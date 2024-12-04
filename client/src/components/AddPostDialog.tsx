'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

export function AddPostDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState('');

  const patientID = localStorage.getItem('patient_id') || '';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically send the new post data to your backend
    console.log('New post:', { title, content });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_LINK}/forum/create`,
        {
          title,
          content,
          categories,
          patient_id: patientID,
        },
      );

      console.log(res.data, 'new post');

      if (String(res.data.status) === 'success') {
        console.log('Post created successfully');

        toast({
          title: 'Post created successfully',
          description: 'Your post has been added to the community forum.',
        });
      }
    } catch (e) {
      console.error('Error creating new post:', e);
    }

    // Reset form and close dialog
    setTitle('');
    setContent('');
    setCategories('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Add New Post</DialogTitle>
          <DialogDescription>
            Create a new post in the community forum. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Categories(seperate by comma)
              </Label>
              <Input
                id="categories"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
