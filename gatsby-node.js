// var Webpack = require('webpack');

// exports.modifyWebpackConfig = function(config, stage) {
//     config.plugin('webpack-define', Webpack.DefinePlugin, [
//         {
//             PRODUCTION: process.env.NODE_ENV === 'production',
//             STATIC: stage === 'build-html',
//         },
//     ]);
//     return config;
// };

const Promise = require('bluebird');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { forEach } = require('lodash');

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;

    return new Promise((resolve, reject) => {
        const Page = path.resolve('./components/Article/index.js');
        resolve(
            graphql(
                `
                    {
                        allMarkdownRemark(sort: { fields: [frontmatter___order], order: DESC }, limit: 1000) {
                            edges {
                                node {
                                    fields {
                                        slug
                                    }
                                    frontmatter {
                                        title
                                        order
                                        background {
                                            childImageSharp {
                                                resize(width: 700) {
                                                    src
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            ).then(result => {
                if (result.errors) {
                    console.log(result.errors);
                    reject(result.errors);
                }

                const posts = result.data.allMarkdownRemark.edges;

                const postsSplit = posts.reduce((postsSplit, post) => {
                    const parent = post.node.fields.slug.split('/')[1];

                    if (!postsSplit[parent]) {
                        postsSplit[parent] = [];
                    }
                    postsSplit[parent].push(post);

                    return postsSplit;
                }, {});

                forEach(postsSplit, posts => {
                    posts.forEach((post, index) => {
                        const next = index === posts.length - 1 ? null : posts[index + 1].node;
                        const previous = index === 0 ? null : posts[index - 1].node;

                        createPage({
                            path: post.node.fields.slug,
                            component: Page,
                            context: {
                                slug: post.node.fields.slug,
                                previous,
                                next,
                            },
                        });
                    });
                });
            })
        );
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;

    if (node.internal.type === `MarkdownRemark`) {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
};
