import mysql.connector
from mysql.connector import Error
config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'quentyn',
    'database': 'recipe2DB'
}
def get_ingredient_id(db_connection, ingredient_name):
    cursor = db_connection.cursor()
    query = "SELECT id FROM ingredient WHERE name = %s"
    cursor.execute(query, (ingredient_name,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        print(f"Ingredient '{ingredient_name}' not found.")
        return None


def get_measure_id(db_connection, measure_name):
    cursor = db_connection.cursor()
    query = "SELECT id FROM measure WHERE name = %s OR abbrev = %s"
    cursor.execute(query, (measure_name, measure_name))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        print(f"Measurement '{measure_name}' not found.")
        return None


def generate_insert_command(recipe_id, ingredient_name, measure_name, amount):
    ingredient_name = ingredient_name.title()
    measure_name = measure_name.title()
    try:
        with mysql.connector.connect(**config) as db_connection:
            ingredient_id = get_ingredient_id(db_connection, ingredient_name)
            measure_id = get_measure_id(db_connection, measure_name)

            if ingredient_id and measure_id:
                sql_command = f"INSERT INTO recipeingredient (recipe_id, ingredient_id, measure_id, amount) VALUES ({recipe_id}, {ingredient_id}, {measure_id}, {amount});"
                print(sql_command)
    except Error as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    recipe_id = 5
    count = int(input("Enter number of ingredients: "))
    ingredient_name =[];
    measure_name = [];
    amount = [];
    for x in range(count):
        ingredient_name.append(input("Enter the ingredient name: "))
        measure_name.append(input("Enter the measurement name: "))
        while True:
            try:
                amount.append(float(input("Enter the amount: ")))
                break
            except ValueError:
                print("Invalid amount.")
    print(" ")
    for x in range(count):
        generate_insert_command(recipe_id, ingredient_name[x], measure_name[x], amount[x])
