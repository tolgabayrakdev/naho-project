import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useToast,
  Progress,
  Input,
  Select,
  Container,
  Flex,
  Badge,
  Divider,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { DownloadIcon, RepeatIcon, SearchIcon } from '@chakra-ui/icons';
import { Helmet } from 'react-helmet-async';

type Feedback = {
  id: string;
  content: string;
};

type AnalysisResult = {
  [key: string]: number;
};

// Basit bir benzerlik kontrolü fonksiyonu
function areSimilarSentences(str1: string, str2: string): boolean {
  const words1 = str1.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const words2 = str2.toLowerCase().split(/\s+/).filter(word => word.length > 3);

  const commonWords = words1.filter(word => words2.includes(word));
  const similarityRatio = commonWords.length / Math.max(words1.length, words2.length);

  return similarityRatio > 0.5; // Benzerlik eşiği
}

export default function Index() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toast = useToast();

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/feedback/user-feedbacks', {
        credentials: 'include',
      });
      const data = await response.json();
      setFeedbacks(data);
      toast({
        title: 'Geri bildirimler alındı',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Geri bildirimler alınırken hata oluştu:', error);
      toast({
        title: 'Hata',
        description: 'Geri bildirimler alınırken bir hata oluştu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeFeedbacks = () => {
    setAnalyzing(true);
    const sentenceGroups: { [key: string]: string[] } = {};

    const performAnalysis = new Promise<void>((resolve) => {
      feedbacks.forEach(feedback => {
        const sentences = feedback.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        sentences.forEach(sentence => {
          const trimmedSentence = sentence.trim();
          if (trimmedSentence.split(/\s+/).length > 2) { // En az 3 kelimelik cümleleri al
            let foundGroup = false;
            for (const [groupKey, sentences] of Object.entries(sentenceGroups)) {
              if (areSimilarSentences(trimmedSentence, groupKey)) {
                sentences.push(trimmedSentence);
                foundGroup = true;
                break;
              }
            }
            if (!foundGroup) {
              sentenceGroups[trimmedSentence] = [trimmedSentence];
            }
          }
        });
      });

      const analysisResult: AnalysisResult = {};
      for (const [groupKey, sentences] of Object.entries(sentenceGroups)) {
        if (sentences.length >= 3) { // En az 3 kez tekrar eden cümle grupları
          analysisResult[groupKey] = sentences.length;
        }
      }

      const sortedSentences = Object.entries(analysisResult)
        .sort(([, a], [, b]) => b - a);

      setTimeout(() => {
        setAnalysisResult(Object.fromEntries(sortedSentences));
        resolve();
      }, 5000);
    });

    // Promise tamamlandığında
    performAnalysis.then(() => {
      setAnalyzing(false);
      setCurrentPage(1);
      toast({
        title: 'Analiz tamamlandı',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const filteredResults = analysisResult
    ? Object.entries(analysisResult).filter(([word]) =>
      word.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const pageCount = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const downloadCSV = () => {
    if (!analysisResult) return;

    const csvContent = "Cümle,Tekrar Sayısı\n" + Object.entries(analysisResult)
      .map(([sentence, count]) => `"${sentence.replace(/"/g, '""')}",${count}`)
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "analiz_sonuclari.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Renk modu değerlerini tanımlayalım
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const boxBgColor = useColorModeValue('gray.50', 'gray.700');
  const boxTextColor = useColorModeValue('blue.700', 'blue.200');

  return (
    <>
      <Helmet>
        <title>Naho App | Rapor Oluştur</title>
      </Helmet>
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Heading as="h2" size="xl" textAlign="center" color={headingColor}>
            Geri Bildirim Raporu
          </Heading>

          <Flex justifyContent="center" wrap="wrap" gap={4}>
            <Tooltip label="Geri Bildirimleri Getir">
              <Button
                leftIcon={<RepeatIcon />}
                onClick={fetchFeedbacks}
                isLoading={loading}
                colorScheme="blue"
                variant="outline"
              >
                Geri Bildirimleri Getir
              </Button>
            </Tooltip>
            <Tooltip label="Analiz Et">
              <Button
                leftIcon={<SearchIcon />}
                onClick={analyzeFeedbacks}
                isLoading={analyzing}
                isDisabled={feedbacks.length === 0}
                colorScheme="green"
                variant="outline"
              >
                Analiz Et
              </Button>
            </Tooltip>
            <Tooltip label="CSV İndir">
              <IconButton
                icon={<DownloadIcon />}
                onClick={downloadCSV}
                isDisabled={!analysisResult}
                colorScheme="teal"
                aria-label="CSV İndir"
              />
            </Tooltip>
          </Flex>

          {feedbacks.length > 0 && (
            <Badge colorScheme="blue" p={2} borderRadius="full" alignSelf="center">
              Toplam Geri Bildirim Sayısı: {feedbacks.length}
            </Badge>
          )}

          {analyzing && (
            <Box>
              <Progress size="xs" isIndeterminate colorScheme="blue" />
              <Text mt={2} fontSize="sm" textAlign="center" color="gray.600">
                Analiz ediliyor, lütfen bekleyin...
              </Text>
            </Box>
          )}

          {analysisResult && (
            <Box bg={bgColor} shadow="md" borderRadius="lg" p={6}>
              <Heading as="h4" size="md" mb={6} textAlign="center" color={headingColor}>
                Analiz Sonuçları
              </Heading>
              <Flex mb={6} gap={4} flexDirection={{ base: 'column', md: 'row' }}>
                <Input
                  placeholder="Kelime ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  flex={1}
                />
                <Select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  width={{ base: 'full', md: '150px' }}
                >
                  <option value="10">10 Sonuç</option>
                  <option value="20">20 Sonuç</option>
                  <option value="50">50 Sonuç</option>
                </Select>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {paginatedResults.map(([sentence, count]) => (
                  <Box key={sentence} p={4} bg={boxBgColor} borderRadius="md" boxShadow="sm">
                    <Text fontWeight="medium" mb={2} color={boxTextColor}>{sentence}</Text>
                    <Badge colorScheme="green">{count} kez</Badge>
                  </Box>
                ))}
              </SimpleGrid>
              <Divider my={6} />
              <Flex justifyContent="center" alignItems="center" gap={4}>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  isDisabled={currentPage === 1}
                  colorScheme="blue"
                  variant="outline"
                >
                  Önceki
                </Button>
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Sayfa {currentPage} / {pageCount}
                </Text>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                  isDisabled={currentPage === pageCount}
                  colorScheme="blue"
                  variant="outline"
                >
                  Sonraki
                </Button>
              </Flex>
            </Box>
          )}
        </VStack>
      </Container>
    </>

  );
}