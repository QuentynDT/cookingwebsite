measures = [
    
    
]
measures = sorted(set(measures))
sql_statements = [f"insert into measure (name, abbrev) values ('{ingredient}');" for ingredient in measures]
for statement in sql_statements:
   print(statement)
