# resturant-api

api 
signup
url "http://localhost:3000/api/signup"
body : { firstName, lastName, email, password, confirmPassword, phoneNumber}
response : 
  error : 
    if status !== 201
      response = {message: ""}
    else 
      response = {message: ""}
        
 ##################
 signin
 url : "http://localhost:3000/api/signin"
 body: {email, password}
 response : 
  error : 
    if status !== 201
      response = {message: ""}
    else 
      response = {
        token: "token",
        _id: "userid",
        email: "useremail",
        profuleImage: ""
      }
#############
add product
url : http://localhost:3000/api/products/add
method: "POST",
body: {
          name ,descripition, category, sizes, toppings, defaultTopping , specialsAdditions 
  if (pizza) {
    body: {name ,descripition, category, sizes, toppings, defaultTopping , specialsAdditions }
  }
  if (drink) {
    body: {name ,descripition, category, sizes }
    
  }
  if (salads) {
    body: {name ,descripition, category, sizes, toppings }
  }
  if (starters) {
    body: {name ,descripition, category, sizes }
  }
  if (pasta) {
    body: {name ,descripition, category, price }
  }
  if (desert) {
    body: {name ,descripition, category, price }
  }
}

sizes: [
  {
      size: "ex: meduim",
      price: ex: 20
    }
    ]

    toppings:  [
            {
                topping: String,
                sizes: [
                    {
                        size: String,
                        price: Number
                    }
                ]
            }
    <!--  -->
    defaultTopping: []
    
    <!--  -->
    specialsAdditions: 
            {
                addition: String,
                sizes: [
                    {
                        size: String,
                        price: Number
                    }
                ]
            }
        
    <!--  -->
    pieces:  [
            {
                pieces: String,
                price: Number
            }
        ]

reponse: 
if (400) {
  {error: checkErrResult};
  or
  {message : "should select correct category"});
  or
  {message : "should select file"})
} 
else (200) {
  {message: "success to add product}
}

################
to show all products for admin
url : http://localhost:3000/api/products/add
method: "GET"
response: 
if (500)
{message: "something went wrong"}
if (200) but no products added before
{message: "There are no products"}
if (200) but no products added before
{products: {
  name: "",
  category: "",
  descripition: ""
product.show = {
  method: "GET",
  url: ""
}
product.image 
}


##########################
to get product admin page
url: localhost:3000/api/products/product/:productId
method: "GET",
response: 
if (500) 
  {message: "something went wrong"}
{
    "id": "60617922c0603f0c482e305d",
    "name": "pastak",
    "category": "pasta",
    "image": "http://localhost:3000/161700073843668747470733a2f2f6d69726f2e6d656469756d2e636f6d2f6d61782f3637382f312a6471766c61737a524c766f506d4152704f6c4c4e39412e706e67.png",
    "descripition": "this is pasta dghdjdold",
    toppings: product.toppings,
    defaultTopping: product.defaultTopping,
    specialsAdditions: product.specialsAdditions,
    pieces: product.pieces,
    price: product.price,
    "delete": {
        "method": "DELETE",
        "url": "http://localhost:3000/api/products/delete",
        "body": {
            "id": "60617922c0603f0c482e305d"
        }
    },
    "update": {
        "method": "POST",
        "url": "http://localhost:3000/api/products/update",
        "body": {
            "id": "60617922c0603f0c482e305d",
            "data": "you should select it"
        }
    }
}


##########
to delete product 
url: http://localhost:3000/api/products/delete
method: DELETE
body: productId
response : 
if (200) 
{message: product is deleted succcessfully}
else 500
{message: something went wrong}








