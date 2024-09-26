import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FiUser, FiClock, FiLink, FiZoomIn, FiZoomOut } from 'react-icons/fi';
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
  IconButton,
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
  const [scale, setScale] = useState(1);

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

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  if (loading) return <Flex justify="center" align="center" h="100vh"><Spinner size="xl" /></Flex>;
  if (error) return <Flex justify="center" align="center" h="100vh" color="red.500">{error}</Flex>;
  if (!previewData) return <Flex justify="center" align="center" h="100vh">Önizleme verisi bulunamadı</Flex>;

  const formUrl = `http://localhost:5173/feedback-form/${previewData.feedback_page.url_token}`;

  return (
    <Box minH="100vh" bg={previewData.gradient} py={8} position="relative">
      <Flex position="fixed" top="4" right="4" zIndex="docked">
        <IconButton
          aria-label="Zoom in"
          icon={<FiZoomIn />}
          onClick={zoomIn}
          mr={2}
          colorScheme="blue"
        />
        <IconButton
          aria-label="Zoom out"
          icon={<FiZoomOut />}
          onClick={zoomOut}
          colorScheme="blue"
        />
      </Flex>
      <Container maxW="2xl" transform={`scale(${scale})`} transformOrigin="top center">
        <VStack spacing={6} align="stretch" bg={useColorModeValue('white', 'gray.700')} borderRadius="lg" overflow="hidden" boxShadow="xl">
          <Box bgGradient={previewData.gradient} p={4}>
            {previewData.logo_url && (
              <Box width="60px" height="60px" borderRadius="full" overflow="hidden" bg="white" mb={3} mx="auto">
                <Image
                  src={previewData.logo_url}
                  alt="Company Logo"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              </Box>
            )}
            <Heading as="h1" size="lg" color="white" mb={2} fontFamily={previewData.font} textAlign="center">
              {previewData.title}
            </Heading>
            <Text color="white" fontFamily={previewData.font} textAlign="center" fontSize="sm">
              {previewData.description}
            </Text>
          </Box>

          <VStack spacing={3} align="stretch" p={4}>
            <Flex align="center" fontFamily={previewData.font} fontSize="sm">
              <Icon as={FiUser} mr={2} />
              <Text>Oluşturan: {previewData.username}</Text>
            </Flex>
            <Flex align="center" fontFamily={previewData.font} fontSize="sm">
              <Icon as={FiClock} mr={2} />
              <Text>Son kullanma tarihi: {new Date(previewData.expires_at).toLocaleString()}</Text>
            </Flex>

            <VStack spacing={3} align="center" mt={6}>
              <Heading as="h2" size="sm" fontFamily={previewData.font}>
                Geri bildirim formuna erişmek için QR Kodu tarayın:
              </Heading>
              <Box bg="white" p={3} borderRadius="md" boxShadow="md">
                <QRCodeSVG value={formUrl} size={150} />
              </Box>
            </VStack>

            <VStack spacing={2} align="center" mt={4}>
              <Text fontFamily={previewData.font} fontSize="sm">veya bu bağlantıyı ziyaret edin:</Text>
              <Link
                href={formUrl}
                color="blue.500"
                _hover={{ color: 'blue.600' }}
                display="inline-flex"
                alignItems="center"
                fontFamily={previewData.font}
                fontSize="sm"
              >
                <Icon as={FiLink} mr={1} />
                {formUrl}
              </Link>
              <Text textAlign="center" fontSize="xs">
                Naho tarafından oluşturuldu.
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}