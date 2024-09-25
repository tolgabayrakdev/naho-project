import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, VStack, Heading, Card, CardHeader, CardBody, useColorModeValue } from '@chakra-ui/react';

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

    // Dark mode uyumlu renkler
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');
    const gridColor = useColorModeValue('#e0e0e0', '#4a4a4a');

    // Yeni renkler
    const colors = {
        Şikayet: "#FF6B6B",
        Öneri: "#FFA500",    // Turuncu
        İstek: "#8A2BE2",    // Mor
        Teşekkür: "#4CAF50"  // Yeşil
    };

    return (
        <Box p={4}>
            <VStack spacing={6} align="stretch">
                <Card bg={bgColor}>
                    <CardHeader>
                        <Heading as="h3" size="sm" color={textColor}>Aylık Geri Bildirim Çizgi Grafiği</Heading>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="name" stroke={textColor} />
                                <YAxis stroke={textColor} />
                                <Tooltip contentStyle={{ backgroundColor: bgColor, color: textColor }} />
                                <Legend />
                                <Line type="monotone" dataKey="Şikayet" stroke={colors.Şikayet} />
                                <Line type="monotone" dataKey="Öneri" stroke={colors.Öneri} />
                                <Line type="monotone" dataKey="İstek" stroke={colors.İstek} />
                                <Line type="monotone" dataKey="Teşekkür" stroke={colors.Teşekkür} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
                <Card bg={bgColor}>
                    <CardHeader>
                        <Heading as="h3" size="sm" color={textColor}>Ay Bazında Geri Bildirim Sütun Grafiği</Heading>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="name" stroke={textColor} />
                                <YAxis stroke={textColor} />
                                <Tooltip contentStyle={{ backgroundColor: bgColor, color: textColor }} />
                                <Legend />
                                <Bar dataKey="Şikayet" fill={colors.Şikayet} />
                                <Bar dataKey="Öneri" fill={colors.Öneri} />
                                <Bar dataKey="İstek" fill={colors.İstek} />
                                <Bar dataKey="Teşekkür" fill={colors.Teşekkür} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
};

export default Charts;