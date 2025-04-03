ingredients = [
    "Almond", "Apple", "Artichoke", "Asparagus", "Bacon", "Barbecue sauce", "Basil", "Bay leaf", "Beef", "Bell pepper",
    "Black bean", "Blue cheese", "Boston cream", "Bread", "Butter", "Cabbage", "Cayenne pepper", "Cheese", "Chicken", "Chili powder",
    "Cinnamon", "Clove", "Cocoa", "Coffee", "Corn", "Cranberry", "Cream", "Cucumber", "Cumin", "Curry powder", "Egg", "Flour",
    "Garlic", "Ginger", "Grape", "Green onion", "Ham", "Honey", "Horseradish", "Ice cream", "Jalapeño", "Kale", "Lemon", "Lettuce",
    "Lime", "Macaroni", "Maple syrup", "Mayonnaise", "Meatball", "Milk", "Mint", "Mushroom", "Mustard", "Nutmeg", "Oatmeal", "Okra",
    "Olive oil", "Onion", "Orange", "Oregano", "Paprika", "Parsley", "Peanut", "Pear", "Pepper", "Pickle", "Pineapple", "Pork",
    "Potato", "Pumpkin", "Raisin", "Ranch dressing", "Raspberry", "Rice", "Rosemary", "Saffron", "Sage", "Salt", "Sausage", "Shrimp",
    "Sour cream", "Soy sauce", "Spinach", "Strawberry", "Sugar", "Granulated Sugar, Powdered Sugar", "Sweet potato", "Tabasco", "Tarragon", "Tea", "Thyme", "Tomato",
    "Turkey", "Vanilla", "Vinegar", "Walnut", "Watermelon", "Wheat", "Yogurt", "Zi"
]
ingredients = sorted(set(ingredients))
sql_statements = [f"INSERT INTO ingredient (name) VALUES('{ingredient}');" for ingredient in ingredients]
for statement in sql_statements:
    print(statement)
