module.exports = app => {
    const posts = require("../controllers/PostController");

    let router = require("express").Router();

    // Create a new Post
    router.post("/create", posts.create);

    // Retrieve all Posts
    //router.get("/all", posts.findAll);

    // Retrieve a single Post with id
    //router.get("/:id", posts.findOne);

    // Update a Posts with id
    //router.put("/:id", tutorials.update);

    // Delete a Post with id
    //router.delete("/:id", posts.delete);

    // Delete all Posts
    //router.delete("/", posts.deleteAll);

    app.use('/api/posts', router);
};