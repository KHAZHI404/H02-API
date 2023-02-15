
type BlogsType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}

export const blogs = [
        {
            id: '1',
            name: 'Andruha',
            description: 'young man',
            websiteUrl: 'https/nice-man.com'
        },
        {
            id: '2',
            name: 'Sanek',
            description: 'old human',
            websiteUrl: 'theoldest.com'
        }
    ]

export const blogsRepository = {

    findAllBlogs(): BlogsType[] {
        return blogs
    },

    findBlogById(id: string) {
        return blogs.find(b => b.id === id)
    },

    createBlog(name: string, description: string, websiteUrl: string) {
        const newBlogs: BlogsType = {
            id: new Date().toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }

        blogs.push(newBlogs)
        return newBlogs
    },

    updateBlog(id: string, name: string, description: string, websiteUrl:string) {
        const blog = blogs.find(b => b.id === id)
        if (!blog) {
            return false
        } else {
            blog.name = name
            blog.description = description
            blog.websiteUrl = websiteUrl
            return true
        }
    },

    deleteBlogs(id: string) {
        for (let i = 0 ; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i, 1)
                return true
            }
        }
        return false
    }

}