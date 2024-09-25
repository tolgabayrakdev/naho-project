import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  useToast,
  IconButton,
  Flex,
  Tooltip,
  Textarea,
  Link,
  Text,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CopyIcon, ViewIcon } from '@chakra-ui/icons';
import { QRCodeSVG } from 'qrcode.react'; // QRCode importu
import { format } from 'date-fns'; // date-fns importu

type FeedbackPage = {
  id: string;
  title: string;
  description: string;
  url_token: string;
  expires_at: string;
};

export default function Pages() {
  const [feedbackPages, setFeedbackPages] = useState<FeedbackPage[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isQrOpen, onOpen: onQrOpen, onClose: onQrClose } = useDisclosure(); // QR modalı için state
  const [qrUrl, setQrUrl] = useState<string | null>(null); // QR kodu için URL
  const toast = useToast();

  useEffect(() => {
    const fetchFeedbackPages = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/feedback-page');
        const data = await response.json();
        console.log(data);

        setFeedbackPages(data);
      } catch (error) {
        console.error('Error fetching feedback pages:', error);
        toast({
          title: "Geri bildirim sayfaları yüklenemedi.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };
    fetchFeedbackPages();
  }, []);

  const handleCreatePage = () => {
    const newPage = {
      title: newTitle,
      description: newDescription,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    fetch('http://localhost:8000/api/feedback-page', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(newPage),
    })
      .then(response => response.json())
      .then(data => {
        setFeedbackPages([...feedbackPages, data]);
        onClose();
        toast({
          title: "Geri bildirim sayfası oluşturuldu.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error creating feedback page:', error);
        toast({
          title: "Geri bildirim sayfası oluşturulamadı.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }); 
  };

  const handleDeletePage = (id: string) => {
    fetch(`http://localhost:8000/api/feedback-page/${id}`, {
      method: 'DELETE',
      credentials: "include"
    })
      .then(() => {
        setFeedbackPages(feedbackPages.filter(page => page.id !== id));
        onDeleteClose();
        toast({
          title: "Geri bildirim sayfası silindi.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error deleting feedback page:', error);
        toast({
          title: "Geri bildirim sayfası silinemedi.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const confirmDeletePage = (id: string) => {
    setPageToDelete(id);
    onDeleteOpen();
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(getFormUrl(token));
    toast({
      title: "Form URL'si kopyalandı.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleShowQr = (token: string) => {
    setQrUrl(getFormUrl(token));
    onQrOpen();
  };

  const getFormUrl = (token: string) => {
    return `${window.location.origin}/feedback-form/${token}`;
  };

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading size="lg">Geri Bildirim Sayfaları</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
          Yeni Sayfa Oluştur
        </Button>
      </Flex>

      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>Başlık</Th>
            <Th>Açıklama</Th>
            <Th>Form URL</Th>
            <Th>Bitiş Tarihi</Th>
            <Th>İşlemler</Th>
          </Tr>
        </Thead>
        <Tbody>
          {feedbackPages.map((page) => (
            <Tr key={page.id}>
              <Td>{page.title}</Td>
              <Td>{page.description}</Td>
              <Td>
                <Tooltip label={getFormUrl(page.url_token)}>
                  <Link href={getFormUrl(page.url_token)} isExternal color="blue.500" textDecoration="underline">
                    {getFormUrl(page.url_token).slice(0, 30)}...
                  </Link>
                </Tooltip>
              </Td>
              <Td>{format(new Date(page.expires_at), 'yyyy-MM-dd HH:mm')}</Td>
              <Td>
                <IconButton
                  aria-label="Copy form URL"
                  icon={<CopyIcon />}
                  size="sm"
                  mr={2}
                  onClick={() => handleCopyToken(page.url_token)}
                />
                <IconButton
                  aria-label="Show QR code"
                  icon={<ViewIcon />}
                  size="sm"
                  mr={2}
                  onClick={() => handleShowQr(page.url_token)}
                />
                <IconButton
                  aria-label="Delete page"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => confirmDeletePage(page.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yeni Geri Bildirim Sayfası Oluştur</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Başlık</FormLabel>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Açıklama</FormLabel>
              <Textarea
                value={newDescription} onChange={(e) => setNewDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePage}>
              Oluştur
            </Button>
            <Button variant="ghost" onClick={onClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Geri Bildirim Sayfasını Sil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Bu sayfayı silmek istediğinizden emin misiniz?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDeletePage(pageToDelete!)}>
              Sil
            </Button>
            <Button variant="ghost" onClick={onDeleteClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isQrOpen} onClose={onQrClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center">Form URL'si için QR Kodu</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center">
            {qrUrl && <QRCodeSVG value={qrUrl} size={256} />}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onQrClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}