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
  HStack,
  Select,
} from '@chakra-ui/react';

type Feedback = {
  id: string;
  content: string;
};

type AnalysisResult = {
  [key: string]: number;
};

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
      const response = await fetch('http://localhost:8000/api/feedback/user-feedbacks', {
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
    const wordCounts: AnalysisResult = {};

    feedbacks.forEach(feedback => {
      const words = feedback.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) { // 3 harften uzun kelimeleri sayalım
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    });

    const sortedWords = Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a);

    setAnalysisResult(Object.fromEntries(sortedWords));
    setAnalyzing(false);
    setCurrentPage(1); // Analiz tamamlandığında ilk sayfaya dön

    toast({
      title: 'Analiz tamamlandı',
      status: 'success',
      duration: 3000,
      isClosable: true,
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

    const csvContent = "Kelime,Tekrar Sayısı\n" + Object.entries(analysisResult)
      .map(([word, count]) => `"${word}",${count}`)
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

  return (
    <Box p={5}>
      <Heading as="h2" size="lg" mb={5}>
        Geri Bildirim Raporu
      </Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Button
            size="sm"
            onClick={fetchFeedbacks}
            isLoading={loading}
            colorScheme="blue"
            mr={3}
          >
            Geri Bildirimleri Getir
          </Button>
          <Button
            size="sm"
            onClick={analyzeFeedbacks}
            isLoading={analyzing}
            isDisabled={feedbacks.length === 0}
            colorScheme="green"
            mr={3}
          >
            Analiz Et
          </Button>
          <Button
            size="sm"
            onClick={downloadCSV}
            isDisabled={!analysisResult}
            colorScheme="teal"
          >
            CSV İndir
          </Button>
        </Box>

        {feedbacks.length > 0 && (
          <Text fontSize="md" fontWeight="bold">
            Toplam Geri Bildirim Sayısı: {feedbacks.length}
          </Text>
        )}

        {analyzing && <Progress size="xs" isIndeterminate />}

        {analysisResult && (
          <Box>
            <Heading as="h4" size="sm" mb={3}>
              Analiz Sonuçları
            </Heading>
            <HStack mb={4} spacing={2}>
              <Input
                size="sm"
                placeholder="Kelime ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                size="sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Select>
            </HStack>
            <SimpleGrid columns={[2, null, 3]} spacing={2}>
              {paginatedResults.map(([word, count]) => (
                <Box key={word} p={2} bg="gray.50" borderRadius="md" fontSize="sm">
                  <Text fontWeight="medium">{word}:</Text>
                  <Text>{count} kez</Text>
                </Box>
              ))}
            </SimpleGrid>
            <HStack justifyContent="center" mt={4}>
              <Button
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
              >
                Önceki
              </Button>
              <Text fontSize="sm">{currentPage} / {pageCount}</Text>
              <Button
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                isDisabled={currentPage === pageCount}
              >
                Sonraki
              </Button>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}