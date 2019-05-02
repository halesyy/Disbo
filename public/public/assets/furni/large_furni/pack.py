import os, json

path  = 'D:\\Projects\\Disbo\\public\\public\\assets\\furni\\large_furni'
files = []
types = [".png", ".gif"]
total = 0
sendback = []

def manage(filename):
    filesplit = filename.split('public\\');
    real = filesplit[2]
    real = real.replace('\\', '/')
    # getting the name of the furni as an identifier
    directories = real.split('/')
    identifier = directories[-1]
    # the last two containers, acting as "categories"
    lastDirectory     = directories[-2]
    lastlastDirectory = directories[-3]

    if ' - ' in lastDirectory:
        category = lastlastDirectory
    else:
        category = lastDirectory

    sendback.append({
        "nameId": identifier,
        "category": category,
        "location": filename.split('ts\\furni\\')[1].replace("\\", '/')
    })

# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        for type in types:
            if type in file:
                total += 1
                manage(os.path.join(r, file));
                # files.append(os.path.join(r, file))

with open('data.json', 'w') as outfile:
    json.dump(sendback, outfile, indent=4, sort_keys=True)

with open('../../../../../private/fexport/data.json', 'w') as outfile:
    json.dump(sendback, outfile, indent=4, sort_keys=True)
