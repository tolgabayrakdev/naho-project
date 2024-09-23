import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Button,
  Container,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  useTheme,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';

type FeedbackPage = {
  title: string;
  description: string;
  logo_url?: string;
  gradient: string;
  font: string;
  background_color: string;
  text_color: string;
  id: string;
  url_token: string;
};

const gradientOptions = [
  { value: 'linear(to-r, teal.500, blue.500)', label: 'Teal to Blue' },
  { value: 'linear(to-r, pink.500, purple.500)', label: 'Pink to Purple' },
  { value: 'linear(to-r, orange.500, red.500)', label: 'Orange to Red' },
  { value: 'linear(to-r, green.400, teal.500)', label: 'Green to Teal' },
  { value: 'linear(to-r, blue.400, purple.500)', label: 'Blue to Purple' },
  { value: 'linear(to-br, yellow.400, orange.500)', label: 'Yellow to Orange' },
  { value: 'linear(to-br, red.500, pink.500)', label: 'Red to Pink' },
  { value: 'linear(to-tr, blue.500, green.500)', label: 'Blue to Green' },
  { value: 'linear(to-tr, purple.500, pink.500)', label: 'Purple to Pink' },
  { value: 'linear(to-b, cyan.500, blue.500)', label: 'Cyan to Blue' },
  { value: 'radial(circle at center, yellow.400, orange.500)', label: 'Radial Yellow to Orange' },
  { value: 'radial(circle at top left, blue.500, purple.500)', label: 'Radial Blue to Purple' },
  { value: 'conic(from 45deg, blue.500, green.500, yellow.500)', label: 'Conic Blue-Green-Yellow' },
];

const fontOptions = [
  { value: 'heading', label: 'Modern' },
  { value: 'body', label: 'Classic' },
  { value: 'mono', label: 'Monospace' },
];

export default function PreviewPage() {
  const theme = useTheme();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState<FeedbackPage>({
    title: '',
    description: '',
    logo_url: '',
    gradient: 'linear(to-r, teal.500, blue.500)',
    font: 'heading',
    background_color: 'white',
    text_color: 'black',
    id: '',
    url_token: '',
  });
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [createdPages, setCreatedPages] = useState<FeedbackPage[]>([]);

  useEffect(() => {
    fetchCreatedPages();
  }, []);

  const fetchCreatedPages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/feedback-page', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Sayfalar yüklenemedi');
      }
      const data = await response.json();
      setCreatedPages(data);
    } catch (error) {
      console.error('Error fetching created pages:', error);
      toast({
        title: "Sayfalar yüklenemedi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/feedback-page/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Sayfa silinemedi');
      }
      setCreatedPages(createdPages.filter(page => page.id !== id));
      toast({
        title: "Sayfa başarıyla silindi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Sayfa silinemedi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPage(prevPage => ({ ...prevPage, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPage(prevPage => ({ ...prevPage, logo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    const printContent = document.querySelector('.printable-content');
    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    if (windowPrint && printContent) {
      windowPrint.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              body { font-family: ${theme.fonts[page.font]}; }
              .gradient-bg { 
                background-image: ${page.gradient};
                color: white;
                padding: 2rem;
                border-radius: 1rem;
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      windowPrint.document.close();
      windowPrint.focus();
      windowPrint.print();
      windowPrint.close();
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/feedback-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(page),
      });

      if (!response.ok) {
        throw new Error('Sayfa yayınlanamadı');
      }

      const data = await response.json();
      setPublishedUrl(`${window.location.origin}/feedback-form/${data.url_token}`);
      onOpen(); // Modal'ı aç
      toast({
        title: "Sayfa başarıyla yayınlandı.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error publishing page:', error);
      toast({
        title: "Sayfa yayınlanamadı.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" p={3}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box>
          <Heading as="h2" size="md" mb={3}>Geri Bildirim Sayfası Oluştur</Heading>
          <VStack spacing={3} align="stretch">
            <FormControl size="sm">
              <FormLabel fontSize="sm">Başlık</FormLabel>
              <Input name="title" value={page.title} onChange={handleInputChange} size="sm" />
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Açıklama</FormLabel>
              <Textarea name="description" value={page.description} onChange={handleInputChange} size="sm" />
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Logo</FormLabel>
              <Input type="file" accept="image/*" onChange={handleLogoUpload} size="sm" />
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Arka Plan Gradient</FormLabel>
              <Select name="gradient" value={page.gradient} onChange={handleInputChange} size="sm">
                {gradientOptions.map(gradient => (
                  <option key={gradient.value} value={gradient.value}>{gradient.label}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Font Stili</FormLabel>
              <Select name="font" value={page.font} onChange={handleInputChange} size="sm">
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </Box>

        <Box>
          <Heading as="h2" size="md" mb={3}>Önizleme</Heading>
          <Box
            bgGradient={page.gradient}
            p={6}
            borderRadius="lg"
            boxShadow="xl"
            className="printable-content gradient-bg"
          >
            <VStack
              spacing={4}
              align="center"
              color="white"
              fontFamily={theme.fonts[page.font]}
            >
              {page.logo_url && (
                <Box
                  width="80px"
                  height="80px"
                  borderRadius="full"
                  overflow="hidden"
                  bg="white"
                >
                  <Image 
                    src={page.logo_url} 
                    alt="Company Logo" 
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </Box>
              )}
              <Heading as="h1" size="xl" textAlign="center" fontWeight="bold">
                {page.title || 'Sayfa Başlığı'}
              </Heading>
              <Text fontSize="md" textAlign="center">
                {page.description || 'Sayfa Açıklaması'}
              </Text>
              <Box bg="white" p={3} borderRadius="md">
                <QRCodeSVG 
                  value={`${window.location.origin}/feedback-form/example`} 
                  size={150}
                />
              </Box>
              <Text fontSize="sm" fontWeight="bold">
                Geri bildiriminiz için QR kodu okutun
              </Text>
            </VStack>
          </Box>
        </Box>
      </SimpleGrid>

      <Button colorScheme="blue" onClick={handlePrint} size="sm" mt={4} mr={2}>
        Yazdır / PDF Olarak Kaydet
      </Button>
      <Button colorScheme="green" onClick={handlePublish} size="sm" mt={4}>
        Yayınla
      </Button>

      <Box mt={8}>
        <Heading as="h2" size="lg" mb={4}>Oluşturulan Sayfalar</Heading>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Başlık</Th>
              <Th>Açıklama</Th>
              <Th>İşlemler</Th>
            </Tr>
          </Thead>
          <Tbody>
            {createdPages.map((page) => (
              <Tr key={page.id}>
                <Td>{page.title}</Td>
                <Td>{page.description}</Td>
                <Td>
                  <IconButton
                    aria-label="View page"
                    icon={<ViewIcon />}
                    mr={2}
                    onClick={() => window.open(`/feedback-form/${page.url_token}`, '_blank')}
                  />
                  <IconButton
                    aria-label="Delete page"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeletePage(page.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sayfa Yayınlandı</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Sayfanız başarıyla yayınlandı. Aşağıdaki link ile erişebilirsiniz:</Text>
            <Input value={publishedUrl || ''} isReadOnly mt={2} />
            <Box mt={4}>
              <QRCodeSVG value={publishedUrl || ''} size={200} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
              navigator.clipboard.writeText(publishedUrl || '');
              toast({
                title: "Link kopyalandı.",
                status: "success",
                duration: 2000,
                isClosable: true,
              });
            }}>
              Linki Kopyala
            </Button>
            <Button variant="ghost" onClick={onClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}