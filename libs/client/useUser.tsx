import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { User } from '@prisma/client';

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const [url, setUrl] = useState<string>();

  const { data, error } = useSWR<ProfileResponse>(url);

  const router = useRouter();

  useEffect(() => {
    if (data && !data.ok) {
      router.replace('/enter');
    }
  }, [data, router]);

  useEffect(() => {
    setUrl('/api/users/me');
  }, []);

  return { user: data?.profile, isLoading: !data && !error };
}
