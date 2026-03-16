import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Flex, Button, Card, Box, Icon } from "@chakra-ui/react";
import { IoLogoGitlab, IoLogoTwitter } from "react-icons/io5";
import { getUserData } from "../lib/user";
import type { User } from "@/domain/user";

export default function CardPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const userData = await getUserData(id);
      if (userData.length > 0) {
        setUser(userData[0]);
      }
    };
    fetch();
  }, [id]);

  const navigate = useNavigate();
  return (
    <Flex justify="center" align="center" minH="100vh">
      <Box textAlign="center" w="320px">
        <Card.Root bg="white" rounded="lg" shadow="md" pl={6}>
          <Card.Header>
            <Card.Title>{user?.name}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Title>自己紹介</Card.Title>
            <Card.Description>{user?.description}</Card.Description>
          </Card.Body>
          <Card.Footer>
            {user?.github_id && (
              <a href={user.github_id} target="_blank" rel="noreferrer">
                <Icon size="lg"><IoLogoGitlab /></Icon>
              </a>
            )}
            {user?.qiita_id && (
              <a href={user.qiita_id} target="_blank" rel="noreferrer">
                <Icon size="lg"><IoLogoTwitter /></Icon>
              </a>
            )}
            {user?.x_id && (
              <a href={user.x_id} target="_blank" rel="noreferrer">
                <Icon size="lg"><IoLogoTwitter /></Icon>
              </a>
            )}
          </Card.Footer>
        </Card.Root>

        <Button
          colorPalette="teal"
          fontWeight="bold"
          width="full"
          mt={2}
          onClick={() => navigate("/")}
        >
          戻る
        </Button>
      </Box>
    </Flex>
  );
}
