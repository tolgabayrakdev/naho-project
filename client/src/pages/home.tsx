import { Box, Button, Flex, Heading, Text, VStack, Image, Container, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Home() {
  const headingColor = useColorModeValue("black", "white");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box>
      <Container maxW="container.xl" py={{ base: 8, md: 10 }}>
        <Flex direction={{ base: "column", lg: "row" }} align="center" justify="space-between">
          <VStack align={{ base: "center", lg: "flex-start" }} spacing={6} maxW="600px" mb={{ base: 10, lg: 0 }}>
            <Heading as="h1" size="2xl" textAlign={{ base: "center", lg: "left" }} color={headingColor}>
              Müşteri İlişkilerinizi Güçlendirin
            </Heading>
            <Text fontSize="xl" textAlign={{ base: "center", lg: "left" }} color={textColor}>
              Anında bildirimler, detaylı analizler ve kişiselleştirilmiş hizmet araçlarıyla
              müşterilerinize en iyi deneyimi sunun.
            </Text>
            <Button as={Link} to="/sign-up" colorScheme="blue" size="lg">
              Hemen Başlayın
            </Button>
          </VStack>
          <Image 
            src="/path-to-your-image.jpg" 
            alt="Müşteri hizmetleri görseli"
            maxW={{ base: "100%", md: "400px", lg: "450px" }}
            mt={{ base: 8, lg: 0 }}
          />
        </Flex>
      </Container>

      <Box bg={useColorModeValue("gray.50", "gray.800")} py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: 8, md: 12 }}>
            <Heading as="h2" size="xl" textAlign="center" color={headingColor}>
              Neden Bizi Seçmelisiniz?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 8, md: 10 }} w="full">
              {features.map((feature, index) => (
                <Box key={index} textAlign="center">
                  <Text fontSize="5xl" mb={4}>{feature.icon}</Text>
                  <Heading as="h3" size="lg" mb={2} color={headingColor}>{feature.title}</Heading>
                  <Text color={textColor}>{feature.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
            <Button as={Link} to="/sign-in" colorScheme="blue" size="lg">
              Giriş Yap
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

const features = [
  {
    icon: "🔔",
    title: "Anında Bildirimler",
    description: "Müşterilerinizden gelen talepleri anında alın ve hızlıca yanıt verin."
  },
  {
    icon: "📊",
    title: "Detaylı Analizler",
    description: "Müşteri davranışlarını analiz edin ve hizmetlerinizi buna göre optimize edin."
  },
  {
    icon: "🤝",
    title: "Kişiselleştirilmiş Hizmet",
    description: "Her müşteriye özel yaklaşım ile memnuniyeti artırın."
  }
];
