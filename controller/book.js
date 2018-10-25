'use strict'

import booksData from '../models/mock/books-data'

class Book {
  constructor(){}
  async getBooks (req, resp, next) {
    if (req.query.userId) {
      let data = booksData.find((e) => {
        if (e.userId === parseInt(req.query.userId)) {
          return e
        }
      })
      resp.send(data ? data.books : '');
    } else {
      // TODO 抛出异常
    }
  }
  async getBookBlogs (req, resp, next) {
    
  }
  async addBook (req, resp, next) {
    
  }
  async getBookRename (req, resp, next) {
    
  }
  async deleteBook (req, resp, next) {
    
  }
}

export default new Book()
