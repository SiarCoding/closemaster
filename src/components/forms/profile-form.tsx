'use client'; // Markiert die Komponente als Client-Komponente

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

// Zod-Schema für die Benutzerdaten, jetzt mit Credits
const ProfileFormSchema = z.object({
  name: z.string().optional(), // Der Name ist optional
  credits: z.string().optional(), // Credits können optional sein
});

type ProfileFormProps = {
  user: {
    id: number;
    clerkId: string;
    name?: string;
    email: string;
    profileImage?: string;
    tier?: string;
    credits?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  onUpdate: (name: string, credits: string) => Promise<void>;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdate }) => {
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user?.name || '',
      credits: user?.credits || '10', // Standardwert für Credits
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
    try {
      await onUpdate(values.name || '', values.credits || '10'); // Fallback zu Standardwerten
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Card className="w-full max-w-[650px] border-none">
      <CardHeader>
        <CardTitle>Profil aktualisieren</CardTitle>
        <CardDescription>Aktualisiere deine Benutzerinformationen</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dein Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input placeholder="Deine Credits" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="mt-4">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Aktualisieren'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
