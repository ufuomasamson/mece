import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useContent } from "@/contexts/ContentContext";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag, FileText } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  status: 'draft' | 'published';
  imageUrl?: string;
}

const BlogManagement = () => {
  const { content, updateContent } = useContent();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    tags: "",
    imageUrl: "",
    status: "draft" as 'draft' | 'published'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newPost: BlogPost = {
        id: editingPost?.id || Date.now().toString(),
        title: blogForm.title,
        content: blogForm.content,
        excerpt: blogForm.excerpt,
        author: blogForm.author,
        date: editingPost?.date || new Date().toISOString().split('T')[0],
        tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: blogForm.status,
        imageUrl: blogForm.imageUrl || undefined
      };

      let updatedPosts;
      if (editingPost) {
        // Update existing post
        updatedPosts = content.blog.posts.map(post => 
          post.id === editingPost.id ? newPost : post
        );
      } else {
        // Add new post
        updatedPosts = [...content.blog.posts, newPost];
      }

      await updateContent({
        ...content,
        blog: {
          ...content.blog,
          posts: updatedPosts
        }
      });

      toast.success(editingPost ? "Blog post updated successfully!" : "Blog post created successfully!");
      resetForm();
      setIsDialogOpen(false);
      setEditingPost(null);
    } catch (error) {
      toast.error("Failed to save blog post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setBlogForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      tags: post.tags.join(', '),
      imageUrl: post.imageUrl || "",
      status: post.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const updatedPosts = content.blog.posts.filter(post => post.id !== postId);
      await updateContent({
        ...content,
        blog: {
          ...content.blog,
          posts: updatedPosts
        }
      });
      toast.success("Blog post deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete blog post");
    }
  };

  const resetForm = () => {
    setBlogForm({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      tags: "",
      imageUrl: "",
      status: "draft"
    });
  };

  const openNewPostDialog = () => {
    setEditingPost(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    resetForm();
  };

  const toggleStatus = async (post: BlogPost) => {
    try {
      const updatedPosts = content.blog.posts.map(p => 
        p.id === post.id 
          ? { ...p, status: p.status === 'published' ? 'draft' : 'published' }
          : p
      );
      
      await updateContent({
        ...content,
        blog: {
          ...content.blog,
          posts: updatedPosts
        }
      });
      
      toast.success(`Post ${post.status === 'published' ? 'unpublished' : 'published'} successfully!`);
    } catch (error) {
      toast.error("Failed to update post status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage your blog posts</p>
        </div>
        <Button onClick={openNewPostDialog} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>New Blog Post</span>
        </Button>
      </div>

      {/* Blog Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({content.blog.posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.blog.posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No blog posts yet. Create your first post!</p>
              </div>
            ) : (
              content.blog.posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User size={16} />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        {post.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag size={16} />
                            <span>{post.tags.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(post)}
                      >
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Blog Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={blogForm.author}
                  onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={blogForm.excerpt}
                onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                placeholder="Enter a brief excerpt (will appear in previews)"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={blogForm.content}
                onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                placeholder="Enter the full blog post content"
                rows={12}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={blogForm.tags}
                  onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                  placeholder="Enter tags separated by commas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image URL</Label>
                <Input
                  id="imageUrl"
                  value={blogForm.imageUrl}
                  onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})}
                  placeholder="Enter image URL (optional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={blogForm.status}
                onChange={(e) => setBlogForm({...blogForm, status: e.target.value as 'draft' | 'published'})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : (editingPost ? "Update Post" : "Create Post")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
