import { Box, Button, Heading, Text, VStack, Container, useColorModeValue, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaPaperPlane, FaRocket } from "react-icons/fa";

export default function Home() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.lg" py={{ base: 16, md: 24 }}>
        <VStack spacing={12} textAlign="center">
          <VStack spacing={6}>
            <Heading as="h1" size="2xl" color={headingColor}>
              Sesinizi Duyurun
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl">
              Düşünceleriniz bizim için değerli. Geri bildiriminizle hizmetlerimizi iyileştirmemize yardımcı olun.
            </Text>
            <Button as={Link} to="/sign-in" colorScheme="blue" size="lg">
              Giriş Yap
            </Button>
          </VStack>

          <VStack spacing={8} w="full">
            <Heading as="h2" size="xl" color={headingColor}>
              Nasıl Çalışır?
            </Heading>
            <VStack spacing={6} w="full">
              {steps.map((step, index) => (
                <Box key={index} textAlign="center" w="full">
                  <Icon as={step.icon} fontSize="3xl" color={headingColor} mb={2} />
                  <Text fontWeight="bold" fontSize="lg" color={headingColor} mb={1}>{step.title}</Text>
                  <Text color={textColor}>{step.description}</Text>
                </Box>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

const steps = [
  {
    icon: FaPencilAlt,
    title: "Geri Bildirim Yazın",
    description: "Düşüncelerinizi ve önerilerinizi bizimle paylaşın."
  },
  {
    icon: FaPaperPlane,
    title: "Gönderin",
    description: "Geri bildiriminizi hızlıca bize iletin."
  },
  {
    icon: FaRocket,
    title: "İyileştirelim",
    description: "Geri bildiriminiz sayesinde hizmetlerimizi geliştiriyoruz."
  }
];
