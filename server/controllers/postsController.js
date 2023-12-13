const { success } = require("../utlis/responseWrapper");

const getAllPostsController = async (req, res) => {
    console.log(req._id);
    return res.send(success, 'These are all the posts');
}

module.exports = {
    getAllPostsController
}