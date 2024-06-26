export class Post {
  title: string;
  content: string;
  writer_id: string;

  static create(title: string, content: string, writer_id: string) {
    const post = new Post();
    post.title = title;
    post.content = content;
    post.writer_id = writer_id;
    return post;
  }
}
