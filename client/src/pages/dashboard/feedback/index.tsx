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
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

type FeedbackType = 'Şikayet' | 'Öneri' | 'İstek' | 'Tebrik';

type FeedbackItem = {
  id: number;
  userName: string;
  message: string;
  type: FeedbackType;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

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
    // Simüle edilmiş API çağrısı
    setIsLoading(true);
      const mockData: FeedbackItem[] = Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        userName: `Kullanıcı${i + 1}`,
        message: `Geri bildirim mesajı ${i + 1}`,
        type: ['Şikayet', 'Öneri', 'İstek', 'Tebrik'][Math.floor(Math.random() * 4)] as FeedbackType,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      }));
      setFeedbackItems(mockData);
      setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = filter === 'Tümü'
        ? feedbackItems
        : feedbackItems.filter(item => item.type === filter);
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
    setFeedbackItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Geri bildirim silindi.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeleteAll = () => {
    setFeedbackItems([]);
    setIsDeleteAllOpen(false);
    toast({
      title: "Tüm geri bildirimler silindi.",
      status: "success",
      duration: 2000,
      isClosable: true,
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
    <Box p={5}>
      <Heading mb={5}>Geri Bildirimler</Heading>
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
              <Th>İşlem</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading 
              ? Array(ITEMS_PER_PAGE).fill(0).map((_, index) => <SkeletonRow key={index} />)
              : currentItems.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.userName}</Td>
                    <Td>
                      <Text 
                        cursor="pointer" 
                        onClick={() => handleMessageClick(item)}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {truncateMessage(item.message)}
                      </Text>
                    </Td>
                    <Td>
                      <Tag colorScheme={getFeedbackTypeColor(item.type)}>
                        {item.type}
                      </Tag>
                    </Td>
                    <Td>{item.createdAt}</Td>
                    <Td>
                      <IconButton
                        aria-label="Sil"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(item.id)}
                        colorScheme="red"
                        size="sm"
                      />
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
                <Text><strong>Kullanıcı:</strong> {selectedFeedback.userName}</Text>
                <Text><strong>Tür:</strong> {selectedFeedback.type}</Text>
                <Text><strong>Tarih:</strong> {selectedFeedback.createdAt}</Text>
                <Text mt={4}><strong>Mesaj:</strong></Text>
                <Text>{selectedFeedback.message}</Text>
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
  );
}