import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Box, Button, Field, Flex, Heading, Input } from "@chakra-ui/react";

export function SearchCard() {
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!id) {
      setError("IDを入力してください");
      return;
    }
    setError("");
    navigate(`/cards/${id}`);
  };

  return (
    <Flex justify="center" align="center" minH="100vh">
      <Box textAlign="center">
        <Heading as="h1" size="3xl" mb={6}>
          デジタル名刺アプリ
        </Heading>
        <Box bg="white" rounded="lg" shadow="md" p={6} w="320px">
          <Field.Root>
            <Field.Label>ID</Field.Label>
            <Input value={id} onChange={(e) => setId(e.target.value)} />
            {error && (
              <Box color="red.500" fontSize="sm">
                {error}
              </Box>
            )}
            <Button
              colorPalette="teal"
              fontWeight="bold"
              width="full"
              mt={2}
              onClick={handleSearch}
            >
              名刺をみる
            </Button>
          </Field.Root>
        </Box>
        <Link to="/cards/register">
          <Box mt={3} fontSize="sm">
            新規登録はこちら
          </Box>
        </Link>
      </Box>
    </Flex>
  );
}
