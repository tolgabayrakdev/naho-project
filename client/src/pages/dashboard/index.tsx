import { Heading, SimpleGrid, Box, Stat, StatLabel, StatNumber, StatHelpText, Icon } from "@chakra-ui/react";
import { FaUsers, FaComments, FaEye } from 'react-icons/fa';
import Charts from "../../components/dashboard/charts";

const StatCard = ({ title, value, icon }: any) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
    <Stat>
      <StatLabel fontSize="lg" fontWeight="medium">{title}</StatLabel>
      <StatNumber fontSize="3xl" fontWeight="bold">{value}</StatNumber>
      <StatHelpText>
        <Icon as={icon} w={6} h={6} color="gray.500" />
      </StatHelpText>
    </Stat>
  </Box>
);

export default function Index() {
  return (
    <div>
      <Heading size="md" mb={6}>Anasayfa</Heading>
      <SimpleGrid p="3" columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <StatCard title="Toplam Kullanıcı" value="1,234" icon={FaUsers} />
        <StatCard title="Toplam Geri Bildirim" value="567" icon={FaComments} />
        <StatCard title="Toplam İzlenme" value="890,123" icon={FaEye} />
      </SimpleGrid>
      <Charts />
    </div>
  )
}