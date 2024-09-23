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
  Text,
  useToast,
  IconButton,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CopyIcon } from '@chakra-ui/icons';

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
  const [newCompanyName, setNewCompanyName] = useState('');
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
      title: newCompanyName,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    fetch('http://localhost:8000/api/feedback-page', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(getFormUrl(token));
    toast({
      title: "Form URL'si kopyalandı.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Firma Adı</Th>
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
                  <Text isTruncated maxWidth="200px">{getFormUrl(page.url_token)}</Text>
                </Tooltip>
              </Td>
              <Td>{page.expires_at}</Td>
              <Td>
                <IconButton
                  aria-label="Copy form URL"
                  icon={<CopyIcon />}
                  size="sm"
                  mr={2}
                  onClick={() => handleCopyToken(page.url_token)}
                />
                <IconButton
                  aria-label="Delete page"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeletePage(page.id)}
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
              <FormLabel>Firma Adı</FormLabel>
              <Input value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} />
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
    </Box>
  );
}