const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql');


// Todo Type
const TodoType = new GraphQLObjectType({
    name: 'Todo',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLBoolean },
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        task: {
            type: TodoType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.get('http://localhost:3000/todolist/' + args.id).then(res => res.data);
            }
        },
        tasks: {
            type: new GraphQLList(TodoType),
            resolve(parentValue, args) {
                return axios.get('http://localhost:3000/todolist').then(res => res.data);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTodo: {
            type: TodoType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLBoolean) },
            },
            resolve(parentValue, args) {
                return axios.post('http://localhost:3000/todolist', {
                    name: args.name,
                    description: args.description,
                    status: args.status
                }).then(res => res.data);
            }
        },
        deleteTodo: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return axios.delete('http://localhost:3000/todolist/' + args.id).then(res => res.data);
            }
        },
        editTodo: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLBoolean },
            },
            resolve(parentValue, args) {
                return axios.patch('http://localhost:3000/todolist/' + args.id, args).then(res => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});