import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Text,
  Flex,
  Button,
  useColorModeValue,
  Tag,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Skeleton,
  SkeletonText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { Helmet } from 'react-helmet-async';

type FeedbackType = 'Şikayet' | 'Öneri' | 'İstek' | 'Tebrik';

type FeedbackItem = {
  id: number;
  customer_email: string;
  content: string;
  feedback_page_title: string;
  feedback_type: FeedbackType;
  created_at: string;
};

const ITEMS_PER_PAGE = 10;

const feedbackTypeMap: { [key: string]: string } = {
  'complaint': 'Şikayet',
  'suggestion': 'Öneri',
  'request': 'İstek',
  'compliment': 'Tebrik'
};

export default function Index() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedbackItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FeedbackType | 'Tümü'>('Tümü');
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    setIsLoading(true);
    fetch(import.meta.env.VITE_BACKEND_URL + '/api/feedback/user-feedbacks', {
      method: "GET",
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setFeedbackItems(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Geri bildirimler alınırken hata oluştu:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = filter === 'Tümü'
        ? feedbackItems
        : feedbackItems.filter(item => feedbackTypeMap[item.feedback_type.toLowerCase()] === filter);
      setFilteredItems(filtered);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500); // 0.5 saniye gecikme
  }, [filter, feedbackItems]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getFeedbackTypeColor = (type: FeedbackType) => {
    switch (type) {
      case 'Şikayet':
        return 'red';
      case 'Öneri':
        return 'orange';
      case 'İstek':
        return 'blue';
      case 'Tebrik':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleDelete = (id: number) => {
    fetch(import.meta.env.VITE_BACKEND_URL + `/api/feedback/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then(response => {
        if (response.ok) {
          setFeedbackItems(prevItems => prevItems.filter(item => item.id !== id));
          toast({
            title: "Geri bildirim silindi.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          throw new Error("Failed to delete feedback");
        }
      })
      .catch(error => {
        console.error("Geri bildirim silinirken hata oluştu:", error);
        toast({
          title: "Geri bildirim silinirken hata oluştu.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const handleDeleteAll = () => {
    fetch(import.meta.env.VITE_BACKEND_URL + '/api/feedback', {
      method: "DELETE",
      credentials: "include"
    })
      .then(response => {
        if (response.ok) {
          setFeedbackItems([]);
          setIsDeleteAllOpen(false);
          toast({
            title: "Tüm geri bildirimler silindi.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          throw new Error("Failed to delete all feedbacks");
        }
      })
      .catch(error => {
        console.error("Tüm geri bildirimler silinirken hata oluştu:", error);
        toast({
          title: "Tüm geri bildirimler silinirken hata oluştu.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const handleMessageClick = (item: FeedbackItem) => {
    setSelectedFeedback(item);
    onOpen();
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.slice(0, maxLength) + '...';
  };

  const SkeletonRow = () => (
    <Tr>
      <Td><Skeleton height="20px" /></Td>
      <Td><Skeleton height="20px" width="60%" /></Td>
      <Td><Skeleton height="20px" width="40px" /></Td>
      <Td><Skeleton height="20px" width="80px" /></Td>
      <Td><Skeleton height="20px" width="40px" /></Td>
    </Tr>
  );

  return (
    <>
      <Helmet>
        <title>Naho App | Geri Bildirimler</title>
      </Helmet>
      <Box p={5}>
        <Box width="fit-content">
          <Heading size="lg" mb={2}>Geri Bildirimler</Heading>
          <Divider borderWidth="1px" mb={4} />
        </Box>
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Text>Toplam: {isLoading ? <SkeletonText noOfLines={1} width="100px" /> : `${filteredItems.length} geri bildirim`}</Text>
          <Flex>
            <Select
              width="200px"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FeedbackType | 'Tümü')}
              mr={2}
              isDisabled={isLoading}
            >
              <option value="Tümü">Tümü</option>
              <option value="Şikayet">Şikayet</option>
              <option value="Öneri">Öneri</option>
              <option value="İstek">İstek</option>
              <option value="Tebrik">Tebrik</option>
            </Select>
            <Button colorScheme="red" onClick={() => setIsDeleteAllOpen(true)} isDisabled={isLoading}>
              Tümünü Sil
            </Button>
          </Flex>
        </Flex>
        <Box overflowX="auto">
          <Table size="sm" variant="simple" bg={bgColor} borderWidth={1} borderColor={borderColor}>
            <Thead>
              <Tr>
                <Th>Kullanıcı</Th>
                <Th>Mesaj</Th>
                <Th>Tür</Th>
                <Th>Tarih</Th>
                <Th>Bildirim Sayfası</Th>
                <Th>İşlem</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading
                ? Array(ITEMS_PER_PAGE).fill(0).map((_, index) => <SkeletonRow key={index} />)
                : currentItems.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.customer_email}</Td>
                    <Td>
                      <Text
                        cursor="pointer"
                      >
                        {truncateMessage(item.content)}
                      </Text>
                    </Td>
                    <Td>
                      <Tag colorScheme={getFeedbackTypeColor(feedbackTypeMap[item.feedback_type.toLowerCase()] as FeedbackType)}>
                        {feedbackTypeMap[item.feedback_type.toLowerCase()]}
                      </Tag>
                    </Td>
                    <Td>{item.created_at}</Td>
                    <Td>{item.feedback_page_title}</Td>
                    <Td>
                      <Flex>
                        <IconButton
                          aria-label="Önizle"
                          icon={<ViewIcon />}
                          onClick={() => handleMessageClick(item)}
                          colorScheme="blue"
                          size="sm"
                          mr={2}
                        />
                        <IconButton
                          aria-label="Sil"
                          icon={<DeleteIcon />}
                          onClick={() => handleDelete(item.id)}
                          colorScheme="red"
                          size="sm"
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
        </Box>
        <Flex justifyContent="space-between" mt={5}>
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1 || isLoading}
          >
            Önceki
          </Button>
          <Text>{isLoading ? <SkeletonText noOfLines={1} width="100px" /> : `Sayfa ${currentPage} / ${totalPages}`}</Text>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            isDisabled={currentPage === totalPages || isLoading}
          >
            Sonraki
          </Button>
        </Flex>

        <AlertDialog
          isOpen={isDeleteAllOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDeleteAllOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Tüm Geri Bildirimleri Sil
              </AlertDialogHeader>

              <AlertDialogBody>
                Tüm geri bildirimleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsDeleteAllOpen(false)}>
                  İptal
                </Button>
                <Button colorScheme="red" onClick={handleDeleteAll} ml={3}>
                  Tümünü Sil
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Mesaj Detay Modalı */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Geri Bildirim Detayı</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedFeedback && (
                <>
                  <Text><strong>Kullanıcı:</strong> {selectedFeedback.customer_email}</Text>
                  <Text><strong>Tür:</strong> {feedbackTypeMap[selectedFeedback.feedback_type.toLowerCase()]}</Text>
                  <Text><strong>Tarih:</strong> {selectedFeedback.created_at}</Text>
                  <Text mt={4}><strong>Mesaj:</strong></Text>
                  <Text>{selectedFeedback.content}</Text>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Kapat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>

  );
}