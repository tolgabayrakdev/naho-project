import { useState, useEffect } from "react";
import { Heading, SimpleGrid, Box, Stat, StatLabel, StatNumber, Icon, Flex, Divider } from "@chakra-ui/react";
import { FaComments, FaSmile, FaLightbulb, FaExclamationCircle, FaQuestionCircle } from 'react-icons/fa';
import Charts from "../../components/dashboard/charts";
import Loading from "../../components/loading";

interface FeedbackStats {
  complaint: number;
  suggestion: number;
  request: number;
  compliment: number;
  total_feedback_count: number;
}

const StatCard = ({ title, value, icon, color }: any) => (
  <Box p={3} shadow="md" borderWidth="1px" borderRadius="lg" bg={color} color="white">
    <Stat>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <StatLabel fontSize="sm" fontWeight="medium">{title}</StatLabel>
          <StatNumber fontSize="xl" fontWeight="bold">{value}</StatNumber>
        </Box>
        <Box>
          <Icon as={icon} w={6} h={6} />
        </Box>
      </Flex>
    </Stat>
  </Box>
);

export default function Index() {
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, monthlyStatsResponse] = await Promise.all([
          fetch(import.meta.env.VITE_BACKEND_URL + '/api/feedback-statics', { credentials: 'include' }),
          fetch(import.meta.env.VITE_BACKEND_URL + '/api/feedback-statics/monthly', { credentials: 'include' })
        ]);

        if (!statsResponse.ok || !monthlyStatsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const statsData: FeedbackStats = await statsResponse.json();
        const monthlyStatsData: any = await monthlyStatsResponse.json();

        setFeedbackStats(statsData);
        setMonthlyStats(monthlyStatsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Box width="fit-content">
        <Heading size="lg" mb={2}>Dashboard</Heading>
        <Divider  borderWidth="1px" mb={4} />
      </Box>
      <SimpleGrid p="2" columns={{ base: 2, md: 3, lg: 5 }} spacing={4} mb={6}>
        <StatCard
          title="Toplam Geri Bildirim"
          value={feedbackStats?.total_feedback_count || 0}
          icon={FaComments}
          color="blue.500"
        />
        <StatCard
          title="Şikayetler"
          value={feedbackStats?.complaint || 0}
          icon={FaExclamationCircle}
          color="red.500"
        />
        <StatCard
          title="Öneriler"
          value={feedbackStats?.suggestion || 0}
          icon={FaLightbulb}
          color="yellow.500"
        />
        <StatCard
          title="İstekler"
          value={feedbackStats?.request || 0}
          icon={FaQuestionCircle}
          color="purple.500"
        />
        <StatCard
          title="Teşekkürler"
          value={feedbackStats?.compliment || 0}
          icon={FaSmile}
          color="green.500"
        />
      </SimpleGrid>
      <Charts monthlyStats={monthlyStats} />
    </div>
  )
}