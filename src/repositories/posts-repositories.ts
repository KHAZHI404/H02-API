import {blogsRepository} from "./blogs-repositories";

type PostsType = {
    id:  string,
    title:  string,
    shortDescription:  string,
    content:  string,
    blogId: string,
    blogName: string
}

export const posts = [
        {
            id:  '1',
            title:  'string',
            shortDescription:  'string',
            content:  'string',
            blogId: 'string',
            blogName: 'string'
        },
        {
            id:  '2',
            title:  'string22',
            shortDescription:  'string22',
            content:  'string22',
            blogId: 'string22',
            blogName: 'string22'
        }
    ]

export const postsRepository = {

    findAllPosts(): PostsType[] {
        return posts
    },

    findPostById(id: string) {
        return posts.find(p => p.id === id)
    },

    createPost(title: string, shortDescription: string, content: string, blogId: string ) {
        const blog = blogsRepository.findBlogById(blogId)
        if (!blog) return  null
        const newPost: PostsType = {
            id: Math.random().toString(36),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog.name
        }
        posts.push(newPost)
        return newPost
    },

    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const blog = blogsRepository.findBlogById(blogId)
        if (!blog) return  null
        const post = posts.find(p => p.id === id)
        if (!post) {
            return false
        } else {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
            post.blogName = blog.name
            return true
        }
    },

    deletePost(id: string) {
        for (let i = 0 ; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1)
                return true
            }
        }
        return false
    }

}
