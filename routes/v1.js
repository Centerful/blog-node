'use strict'

import express from 'express'
import expressAsyncErrors from 'express-async-errors'
import Base from '../controller/common/base'
import login from '../controller/login'
import authority from '../controller/authority'
import blog from '../controller/blog'
import book from '../controller/book'
import column from '../controller/column'
import comment from '../controller/comment'
import feed from '../controller/feed'
import message from '../controller/message'
import tag from '../controller/tag'
import thumb from '../controller/thumb'
import user from '../controller/user'

const router = express.Router()

// 欢迎页面
router.get('/', async function(req, res, next) {
  console.log('welcome')
  throw new Error('welcome, error!')
  res.render('index', { title: ' Blog!' });
});

// common请求URL
router.post('/seq', new Base().getSeq)

// 博客请求URL
router.get('/blogs', blog.getBlogs)
router.get('/blogs/:id', blog.getBlogById)
router.post('/blogs', blog.addBlog)
router.put('/blogs/:id', blog.updateBlog)
router.delete('/blogs/:id/trash', blog.deleteToTrash)
router.get('/blogs/:id/extends', blog.getBlogExtends)
router.get('/blogs/:id/comments', blog.getBlogComments)
router.post('/blogs/:id/comments', blog.addBlogComment)
router.delete('/blogs/:id/comments/:commentId', blog.deleteBlogComment)
router.patch('/blogs/:id/publish', blog.pulish)
router.patch('/blogs/:id/move', blog.move)
router.patch('/blogs/:id/reorder', blog.reorder)
router.post('/blogs/:id/thumb', blog.addThumb)
router.delete('/blogs/:id/thumb', blog.deleteThumb)
router.get('/blogs/:id/history', blog.getBlogHistorys)
router.get('/blogs/:id/history/:hisId', blog.getBlogHistory)
router.patch('/blogs/:id/reversion', blog.reversion)

// trash请求URL
router.get('/trashs', blog.getTrashs)
router.get('/trashs/:id', blog.getTrashById)
router.put('/trashs/:id', blog.updateTrash)
router.patch('/trashs/:id/restore', blog.restore)
router.delete('/trashs/:id', blog.deleteTrash)

// 文集请求URL
router.get('/books', book.getBooks)
router.get('/books/:id/blogs', book.getBookBlogs)
router.post('/books', book.addBook)
router.patch('/books/:id/rename', book.getBookRename)
router.delete('/books/:id', book.deleteBook)

// 专栏请求URL
router.get('/columns', column.getColumns)
router.get('/columns/:id', column.getColumnById)
router.post('/columns', column.addColumn)
router.put('/columns/:id', column.updateColumn)
router.patch('/columns/:id', column.patchColumn)
router.delete('/columns/:id', column.deleteColumn)
router.get('/columns/:id/blogs', column.getColumnBlogs)
router.delete('/columns/:id/blogs/:blogId', column.blogRemove)

// 评论请求URL
router.put('/comments/:id', comment.updateComment)
router.delete('/comments/:id', comment.deleteComment)
router.post('/comments/:id/thumb', comment.addThumb)
router.delete('/comments/:id/thumb', comment.deleteThumb)

// feed请求URL
router.get('/feeds', feed.getFeeds)
router.post('/feeds', feed.addFeeds)
router.delete('/feeds/:id', feed.deleteFeeds)
router.patch('/feeds/:id/encrypt', feed.encrypt)
router.patch('/feeds/:id/private', feed.private)
router.get('/feeds/:id/comments', feed.getFeedComments)
router.post('/feeds/:id/comments', feed.addFeedComment)
router.delete('/feeds/:id/comments/:commentId', feed.deleteFeedComment)
router.post('/feeds/:id/thumb', feed.addThumb)
router.delete('/feeds/:id/thumb', feed.deleteThumb)

// tag请求URL
router.get('/tags', tag.getTags)
router.get('/tags/:id', tag.getTagById)
router.post('/tags', tag.addTag)
router.delete('/tags/:id', tag.deleteTag)

// thumb请求URL
router.get('/thumbs', thumb.getThumbs)
router.get('/thumbs/:id/users', thumb.getThumbUsers)

// User请求URL
router.get('/users', user.getUsers)
router.get('/users/:id', user.getUserById)
router.put('/users/:id', user.updateUser)
router.delete('/users/:id', user.deleteUser)
router.get('/users/:id/messages', user.getUserMessages)

// admin请求URL
router.post('/login', login.login)
router.post('/logout', login.logout)
router.post('/register', login.register)
router.patch('/resetpw', login.resetpw)

// message请求URL.
router.get('/messages', message.getMessages)
router.get('/messages/:id', message.getMessageById)
router.post('/messages', message.addMessage)
router.patch('/messages/:id/seen', message.seen)

// authority???

export default router
