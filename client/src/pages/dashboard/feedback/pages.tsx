import React, { useState, useEffect } from 'react';
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
  companyName: string;
  token: string;
  expiresAt: string;
};

export default function Pages() {
  const [feedbackPages, setFeedbackPages] = useState<FeedbackPage[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newCompanyName, setNewCompanyName] = useState('');
  const toast = useToast();

  useEffect(() => {
    // Burada normalde API'den feedback page listesini çekeceksiniz
    // Şimdilik mock data kullanıyoruz
    const mockPages: FeedbackPage[] = [
      { id: '1', companyName: 'ABC Şirketi', token: 'abc123', expiresAt: '2023-06-01' },
      { id: '2', companyName: 'XYZ Ltd.', token: 'def456', expiresAt: '2023-07-01' },
    ];
    setFeedbackPages(mockPages);
  }, []);

  const handleCreatePage = () => {
    // Burada normalde API'ye yeni feedback page oluşturma isteği göndereceksiniz
    const newPage: FeedbackPage = {
      id: String(feedbackPages.length + 1),
      companyName: newCompanyName,
      token: Math.random().toString(36).substr(2, 8),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 ay sonra
    };
    setFeedbackPages([...feedbackPages, newPage]);
    onClose();
    toast({
      title: "Geri bildirim sayfası oluşturuldu.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeletePage = (id: string) => {
    // Burada normalde API'ye feedback page silme isteği göndereceksiniz
    setFeedbackPages(feedbackPages.filter(page => page.id !== id));
    toast({
      title: "Geri bildirim sayfası silindi.",
      status: "success",
      duration: 2000,
      isClosable: true,
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
            <Th>Form URL</Th>
            <Th>Bitiş Tarihi</Th>
            <Th>İşlemler</Th>
          </Tr>
        </Thead>
        <Tbody>
          {feedbackPages.map((page) => (
            <Tr key={page.id}>
              <Td>{page.companyName}</Td>
              <Td>
                <Tooltip label={getFormUrl(page.token)}>
                  <Text isTruncated maxWidth="200px">{getFormUrl(page.token)}</Text>
                </Tooltip>
              </Td>
              <Td>{page.expiresAt}</Td>
              <Td>
                <IconButton
                  aria-label="Copy form URL"
                  icon={<CopyIcon />}
                  size="sm"
                  mr={2}
                  onClick={() => handleCopyToken(page.token)}
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