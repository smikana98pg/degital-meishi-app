import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Spinner } from "@chakra-ui/react";
import { getUserData } from "../repositories/user";
import type { User } from "@/domain/user";
import { UserCard } from "../components/UserCard";

export default function CardPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData(id);
        setUser(userData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return <Spinner data-testid="loading" />;
  }

  return <UserCard user={user} />;
}
