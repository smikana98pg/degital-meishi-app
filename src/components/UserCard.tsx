import { Flex, Button, Card, Box, Icon } from "@chakra-ui/react";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io5";
import { SiQiita } from "react-icons/si";
import { useNavigate } from "react-router";
import type { User } from "@/domain/user";

interface Props {
  user: User | null;
}

export function UserCard({ user }: Props) {
  const navigate = useNavigate();

  return (
    <Flex justify="center" align="center" minH="100vh">
      <Box textAlign="center" w="320px">
        <Card.Root bg="white" rounded="lg" shadow="md">
          <Card.Header>
            <Card.Title>{user?.name}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Title fontSize="16px">自己紹介</Card.Title>
            <Card.Description>{user?.description}</Card.Description>
            <Card.Title fontSize="16px">好きな技術</Card.Title>
            <Card.Description>{user?.skills.join(", ")}</Card.Description>
          </Card.Body>
          <Card.Footer>
            <Flex justify="space-between" width="full">
              {user?.github_id && (
                <a href={user.github_id} target="_blank" rel="noreferrer">
                  <Icon size="lg">
                    <IoLogoGithub />
                  </Icon>
                </a>
              )}
              {user?.qiita_id && (
                <a href={user.qiita_id} target="_blank" rel="noreferrer">
                  <Icon size="lg">
                    <SiQiita />
                  </Icon>
                </a>
              )}
              {user?.x_id && (
                <a href={user.x_id} target="_blank" rel="noreferrer">
                  <Icon size="lg">
                    <IoLogoTwitter />
                  </Icon>
                </a>
              )}
            </Flex>
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
