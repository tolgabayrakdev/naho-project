import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Button,
  useColorModeValue,
  Container,
  useToast,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';

type FeedbackPage = {
  id: string;
  title: string;
  description: string;
  url_token: string;
  logo_url?: string;
};

export default function FormPage() {
  const { token } = useParams<{ token: string }>();
  const [page, setPage] = useState<FeedbackPage | null>(null);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/feedback-page/${token}`);
        if (!response.ok) {
          throw new Error('Sayfa bulunamadı');
        }
        const data = await response.json();
        setPage(data);
      } catch (error) {
        console.error('Error fetching page data:', error);
        toast({
          title: "Sayfa yüklenemedi.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (token) {
      fetchPageData();
    }
  }, [token, toast]);

  const handlePrint = () => {
    window.print();
  };

  if (!page) {
    return <Box>Yükleniyor...</Box>;
  }

  return (
    <Container maxW="container.md" p={5}>
      <VStack
        spacing={8}
        align="center"
        bg={bgColor}
        color={textColor}
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        className="printable-content"
      >
        {page.logo_url && (
          <Image src={page.logo_url} alt="Company Logo" maxH="100px" />
        )}
        <Heading as="h1" size="xl" textAlign="center">
          {page.title}
        </Heading>
        <Text fontSize="lg" textAlign="center">
          {page.description}
        </Text>
        <Box>
          <QRCodeSVG 
            value={`${window.location.origin}/feedback-form/${page.url_token}`} 
            size={200}
          />
        </Box>
        <Text fontSize="md" fontWeight="bold">
          Geri bildiriminiz için QR kodu okutun
        </Text>
      </VStack>
      <Button mt={4} colorScheme="blue" onClick={handlePrint}>
        Yazdır / PDF Olarak Kaydet
      </Button>
    </Container>
  );
}