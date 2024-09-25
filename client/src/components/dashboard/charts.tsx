import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, VStack, Heading, Card, CardHeader, CardBody } from '@chakra-ui/react';

interface MonthlyFeedbackStats {
  [month: number]: {
    complaint: number;
    suggestion: number;
    request: number;
    compliment: number;
  }
}

interface ChartsProps {
  monthlyStats: MonthlyFeedbackStats | null;
}

const Charts: React.FC<ChartsProps> = ({ monthlyStats }) => {
    const turkishMonths = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const data = monthlyStats ? Object.entries(monthlyStats).map(([month, stats]) => ({
        name: turkishMonths[parseInt(month) - 1],
        Şikayet: stats.complaint,
        Öneri: stats.suggestion,
        İstek: stats.request,
        Teşekkür: stats.compliment
    })) : [];

    return (
        <Box p={4}>
            <VStack spacing={6} align="stretch">
                <Card>
                    <CardHeader>
                        <Heading as="h3" size="sm">Aylık Geri Bildirim Çizgi Grafiği</Heading>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Şikayet" stroke="#FF0000" />
                                <Line type="monotone" dataKey="Öneri" stroke="#00FF00" />
                                <Line type="monotone" dataKey="İstek" stroke="#0000FF" />
                                <Line type="monotone" dataKey="Teşekkür" stroke="#6c6e6b" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <Heading as="h3" size="sm">Ay Bazında Geri Bildirim Sütun Grafiği</Heading>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Şikayet" fill="#FF0000" />
                                <Bar dataKey="Öneri" fill="#00FF00" />
                                <Bar dataKey="İstek" fill="#0000FF" />
                                <Bar dataKey="Teşekkür" fill="#FF00FF" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
};

export default Charts;