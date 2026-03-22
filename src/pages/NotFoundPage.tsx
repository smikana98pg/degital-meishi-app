import { Flex, Box, Heading, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Flex justify="center" align="center" minH="100vh">
      <Box textAlign="center">
        <Heading as="h1" size="3xl" mb={4}>
          404
        </Heading>
        <Heading as="h2" size="lg" mb={6}>
          ページが見つかりません
        </Heading>
        <Button
          colorPalette="teal"
          fontWeight="bold"
          onClick={() => navigate("/")}
        >
          トップへ戻る
        </Button>
      </Box>
    </Flex>
  );
}
