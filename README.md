<h1># boilerplateGraphql</h1> 
Level: Intermediate

</br></br>

<p align="center">
  <img width="600" height="150" src="https://user-images.githubusercontent.com/42190220/75618561-115be300-5b4f-11ea-8968-8296ff4127ed.png">
</p>
</br></br>

<p align="center">
Quick start for an base app with user validation JWT, PostgreSQL connection and Sequelize ORM, Server Express and Express-Graphql configured! 
A boilerplate full of interesting basic features implemented, such as: Validation of input fields with YUP, automated tests using mocha and chai, analysis of test coverage with NYC, security and header management with Helmet, password encryption with Bcrypt Js, enhancement Graphql queries with Dataloaders and AST, using Node clusters, automated tasks with Gulp and lots of more...
</p>

</br>

Get start!

<h3>Requirements:</h3>

* NodeJs v8.6.0
* PostgreSQL 11.5  

</br>

<h3>Steps run dev:</h3>

1. Clone the repository
2. Make sure that service Postegre is running
3. Go to the project root in terminal
4. Run the command: "npm install"
5. Run the command: "npm run gulp" 
6. Run the command: "npm run dev"

And... ok, hands'on!

</br></br>

# Helpers
* [Postman and Graphiql](#use) </br>
* [Existing Scripts](#scripts) </br>
* [How to create a new resource](#resources) </br>
* [How to create a new test](#tests) </br>
* [What are validations?](#validations) </br>
* [Validation architecture](#validations) </br>
* [How to create a new validation](#validations) </br>
* [How to use a validation](#validations) </br>
* [What are authentication?](#authentication) </br>
* [Authentication architecture](#authentication) </br>
* [How to use a authentication](#authentication) </br>
* [What is a Dataloader?](#dataloaders) </br>
* [When to create a Dataloader?](#dataloaders) </br>
* [Improvements to the production environment](#improvements) </br>

</br></br>

# Use
<h3>Postman and Graphiql</h3>

</br>

<h3>Postman</h3>

</br>

The Postman collection and variables are incorporated into the project and are available for use. Just import to postman!
</br>
* Acces the path: "postman->apiGraphql.postman_collection.json" and import of Postman.

***
<!> **_Note: A token must be assigned the collection token variable to access the protected routes._**
***

</br>

<h3>Graphiql</h3>

By default, Graphiql is already enabled in development mode. To use, just:</br>

* run the project in dev mode</br>
Run the command: "npm run gulp"</br>
Run the command: "npm run dev"</br>

* Access the Graphiql endpoint</br>
Open the browser and access: http://localhost:3000/graphql

</br></br>

# Scripts
<h3>Existing Scripts</h3>

In root folder:</br>
Run the command: "npm run dev" to run in dev mode</br>
Run the command: "npm test" to run the tests</br>
Run the command: "npm run coverage" to create the test coverage files</br>
Run the command: "npm run gulp" to run tasks the gulp</br>
Run the command: "npm run build" to build the project</br>
Run the command: "npm run clusters" to run the project using clustering</br>
Run the command: "npm start" to build and run using clustering</br>

</br></br>

# Resources
<h3>How to create a new resource</h3>

**Step 1: Create a new Model**</br>
*Definition: Model defines the data structure model in the system and represents the physical model of the data, creating the object for data manipulation.*</br>

* To create a new model, access the path "src-> Models" and create a new model file using the template located in the folder as a base.

</br></br>

**Step 2: Add the model to ModelInterface**</br>
*Definition: The ModelInterface is the interface that exposes the models available in the system.*

* To add in ModelInterface access the path "src->interfaces->ModelsInterface" and import the newly created model, also export in the interface, as an example of the template.

</br></br>

**Step 3: Define the graphql schema of the new resource**</br>
*Definition: The graphql schema must define the types of data structures and methods of data manipulation (queries and mutations).*

* To create the new resource schema access the path "src->graphql->resources" and create a new schema file that can be based on the template located in "src->graphql->resources->template->template.schema.ts".

</br></br>

**Step 4: Define the graphql resolver of the new resource**</br>
*Definition: The resolvers must implement the methods defined in the schema graphql and have the role of maintaining all the logic of access and manipulation of the input and output data.*

* To create the new resolver access the path "src->graphql->resources" and create a new resolver file that can be based on the template located in "src->graphql->resources->template->template.resolver.ts".

</br></br>

**Step 5: Define the validation of the input fields**</br>
*Definition: The validation must contain the rules for formatting the input data.*

* To create a new validation access the path "src->graphql->resources" and create a new validation file that can be based on the template located in "src->graphql->resources->template->template.validation.ts". 
[Read more (validation)](#validations).

</br>

***
<!> **_Note: to improve the project organization, all mutations, queries and schemas are created separately by resources and are then merged, creating a single graphql schema as it should be._**
***

</br>

**Step 6: Merge mutations a single object**</br>
*Definition: The mutation.ts file must import all mutations created individually with its resources and merge them all, exporting a single mutation object*

* To merge the mutations access the path "src->graphql->mutation.ts" import the mutations created in step 3 in the schema graphql and interpolate with the other existing ones in the file (Mutation.ts), the templateMutations that are imported in the file can be used as base.

</br></br>

**Step 7: Merge queries a single object**</br>
*Definition: The query.ts file must import all queries created individually with its resources and merge them all, exporting a single query object*

* To merge the queries access the path "src->graphql->query.ts" import the queries created in step 3 in the schema graphql and interpolate with the other existing ones in the file (query.ts), the templateQueries that are imported in the file can be used as base.

</br></br>

**Step 8: Export the complete graphql schema**</br>
*Definition: Now all data must be unified and the definitive graphql schema is assembled.*

* To unify the schema access the path "src->graphql->schema.ts" and: </br>
**a)** Import the new resolver created and merge with the others, being able to follow the templateResolvers that is imported in the file as a base.</br>
**b)** When exporting the graphql schema insert the types of the new resource, being able to follow the templateTypes that are imported in the file as a base.</br>

</br></br>

# Tests
<h3>How to create a new test</h3>

**Input fields validation test**</br>
*Definition: Tests to validate the resolvers and their return object.*

* To create a new input validation test access the path "test->inputs" and create a new test file that can be based on the template located in "test->inputs->*template->template.validations.test.ts". 


**Resolvers test**</br>
*Definition: Now all data must be unified and the definitive graphql schema is assembled.*

* To create a new resolver test access the path "test->resources" and create a new test file that can be based on the template located in "test->resources->*template->template.resolvers.test.ts". 

</br></br>

# Validations
<h3>What are validations?</h3>

The validation resolver is orchestrated by the composable function, being called before the resolver of query or mutation. It's as if it were intercepting the request(almost a middleware) to validate the input fields, releasing only if entries go through all defined validations. If any incosistence is found it bar before even reaching the resolver of query or mutations and the request must return the validation error messages found.

</br>

<h3>Validation architecture</h3>

In "src->graphql->composable":

* **validation-fields.resolver.ts -** Responsible for function call for find the schema of method in context and do a schema validation. If find any error in the validation schema crashes the request and return the inconsistency errors, 
 if the schema is validated correctly, call the next resolver and follows normally the aplication flow. </br>
  
In "src->graphql->validation":

* **schema-messages.ts -** Responsible for defining, patterning and expose the system validation error messages.</br>

* **schema-custom-types.ts -** Responsible for defining the schema of validation for custom fields. Preferably using standard error messages.</br>

* **schema-validation.ts -** Responsible for unifying all validation schemas and export only the schema for the requested method.</br>

In "src->graphql->resources->_your-resource-name_->_your-resrouce-name-validation.ts": </br>
  
* **_your-resrouce-name_-validation.ts -** Responsible for exporting a complete validation schema for each method of your resolver. Must use the custom field validations and default messages because of code reuse. </br>

</br>

<h3>How to create a new validation</h3>

* To create a new validation file, before should create folder in the path "src->graphql->resources->_your-resource-name-validation_" and create the new file in the folder. That can be based on the template located in "src->graphql->resources->*template->template.validation.ts".

</br>

<h3>How to use a validation</h3>

To use the new validation is very easy, only:
* Import compose from "src/graphql/composable/composable.resolver.ts" 
* Import validationFieldsResolver from "src/graphql/composable/validation-fields.resolver.ts"
* After call the compose, sending by parameter the validationFieldsResolver in your query or mutation

That can be based on the template located in file "src->graphql->resources->*template->template.resolver.ts" in the mutation "createTemplate".

</br></br>

# Authentication
<h3>What are authentication?</h3>

The authentication system for this project was defined for use JWT(Json Web Token). Uses tokens to verify the authentication of requests being received, it is also allowed to accept requests that do not require authentication. The jwt token is also responsible for loading part of the application's user context such as: user, email and id.

</br>

<h3>Authentication architecture</h3>

In "src->middlewares":

* **extract-jwt.middleware.ts -** Responsible for loading the application's user context if a token is sent along with the request.</br>

In "src->graphql->composable":

* **auth.resolver.ts -** Responsible for checking if the user's context has already been loaded or if at least the authorization header was sent with the request.</br>

* **verify-token.resolver.ts -** Responsible for checking if the token sent with the request is a valid token.</br>

</br>

<h3>How to use a authentication</h3>

To use authentication is very easy, only:
* Import compose from "src/graphql/composable/composable.resolver" 
* Import authResolver from "src/graphql/composable/auth.resolver.ts"
* Import verifyTokenResolver from "src/graphql/composable/validation-fields.resolver.ts"
* After call the compose, sending by parameter the authResolver and verifyTokenResolver in your query or mutation

That can be based on the template located in file "src->graphql->resources->*template->template.resolver.ts" in the mutation "createTemplate".

</br></br>

# Dataloaders
<h3>What is a Dataloader?</h3>

The dataloader is a lib created by facebbok that helps a lot in optimizing queries to the database among other sources. 
Basically it uses cache and batch queries to decrease the amount of trips to the database to resolve a query.

</br>

An Example:

<p align="center">
  <img width="600" height="200" src="https://user-images.githubusercontent.com/42190220/75618588-6697f480-5b4f-11ea-898e-04cc9ad8fa71.png">
</p>

</br>

In this scenario, without use data loader. When doing a graphql query that returns all posts and your user creator, for each post he will make a query in the user's table. What, in fact, may  tue low performance.
</br></br>
The use of Dataloader avoids this, causing each subquery in the user table to be performed only once for each user. If we have ten posts from the same user, he will consult the user table only once.
</br></br>
More details in the official documentation: https://github.com/graphql/dataloader

</br>

<h3>When to create a Dataloader?</h3>

Bad news, don't have a cake recipe for that matter.</br>
The creation of new Dataloaders can vary a lot according to each specific case, the scenario should always be analyzed to raise possible points where the loaders fit.</br>
So it is always good to analyze the database modeling documents and also monitor the query logs to identify possible bottleneck. A well done analysis and coverage depends on the experience of the responsible developer.

</br></br>

# Improvements
<h3>Improvements to the production environment</h3>

Currently, the secret key used to decrypt the token is being defined in the scripts using an environment variable and the variables of access to the bank are also vulnerable in a system file.
It would be interesting to use safer approaches when using the system in production.

</br>

The variable that defines the port on which the system should run is described statically in the system's index file. A more dynamic approach could be used to facilitate possible changes.
