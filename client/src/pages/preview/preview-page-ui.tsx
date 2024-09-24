import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FiUser, FiClock, FiLink } from 'react-icons/fi';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Flex,
  Icon,
  Link,
  Spinner,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';

interface PreviewData {
  id: number;
  title: string;
  description: string;
  url_token: string;
  expires_at: string;
  username: string;
  email: string;
  logo_url?: string;
  gradient: string;
  font: string;
  feedback_page: {
    id: number;
    title: string;
    url_token: string;
  };
}

export default function PreviewPage() {
  const { token } = useParams<{ token: string }>();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/preview-page/${token}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Bu sayfa mevcut değil');
        }
        const data = await response.json();
        console.log(data);
        
        setPreviewData(data);
      } catch (err) {
        setError('Bu sayfa mevcut değil');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [token]);

  if (loading) return <Flex justify="center" align="center" h="100vh"><Spinner size="xl" /></Flex>;
  if (error) return <Flex justify="center" align="center" h="100vh" color="red.500">{error}</Flex>;
  if (!previewData) return <Flex justify="center" align="center" h="100vh">Önizleme verisi bulunamadı</Flex>;

  const formUrl = `http://localhost:5173/feedback-form/${previewData.feedback_page.url_token}`;

  return (
    <Box minH="100vh" bg={previewData.gradient} py={12}>
      <Container maxW="3xl">
        <VStack spacing={8} align="stretch" bg={useColorModeValue('white', 'gray.700')} borderRadius="lg" overflow="hidden" boxShadow="xl">
          <Box bgGradient={previewData.gradient} p={6}>
            {previewData.logo_url && (
              <Box width="80px" height="80px" borderRadius="full" overflow="hidden" bg="white" mb={4} mx="auto">
                <Image 
                  src={previewData.logo_url} 
                  alt="Company Logo" 
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              </Box>
            )}
            <Heading as="h1" size="xl" color="white" mb={2} fontFamily={previewData.font} textAlign="center">
              {previewData.title}
            </Heading>
            <Text color="white" fontFamily={previewData.font} textAlign="center">
              {previewData.description}
            </Text>
          </Box>
          
          <VStack spacing={4} align="stretch" p={6}>
            <Flex align="center" fontFamily={previewData.font}>
              <Icon as={FiUser} mr={2} />
              <Text>Oluşturan: {previewData.username}</Text>
            </Flex>
            <Flex align="center" fontFamily={previewData.font}>
              <Icon as={FiClock} mr={2} />
              <Text>Son kullanma tarihi: {new Date(previewData.expires_at).toLocaleString()}</Text>
            </Flex>
            
            <VStack spacing={4} align="center" mt={8}>
              <Heading as="h2" size="md" fontFamily={previewData.font}>
                Geri bildirim formuna erişmek için QR Kodu tarayın:
              </Heading>
              <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                <QRCodeSVG value={formUrl} size={200} />
              </Box>
            </VStack>
            
            <VStack spacing={2} align="center" mt={6}>
              <Text fontFamily={previewData.font}>veya bu bağlantıyı ziyaret edin:</Text>
              <Link
                href={formUrl}
                color="blue.500"
                _hover={{ color: 'blue.600' }}
                display="inline-flex"
                alignItems="center"
                fontFamily={previewData.font}
              >
                <Icon as={FiLink} mr={1} />
                {formUrl}
              </Link>
            </VStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}