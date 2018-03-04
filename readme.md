# BITnet

BITnet is a simple CLI tool to help students of BIT Mesra, Ranchi, India, to login to cyberoam. Cyberoam is the network login portal in BIT Mesra.

## Features

* Easy installation with one npm command.
* Easy login and logout with simple global scoped commands.
* Can set an array or site URLs which would be opened on your default browser upon login.

## Installation and Setup

1. Install globally using npm

    ```bash
    $ npm i -g @dexter08/bitnet
    ```

2. Configure login credentials

    ```bash
    $ bitnet config
    ```

3. Login by

    ```bash
    $ bitnet login
    ```

4. Logout with

    ```bash
    $ bitnet logout
    ```
To view all commands run

```bash
$ bitnet help
```

## BITnet help

* **bitnet help** - view all bitnet commands
* **bitnet config** - save login credentials
* **bitnet login** - login to cyberoam
* **bitnet li** - short for 'bitnet login'
* **bitnet logout** - logout from cyberaom
* **bitnet lo** - short for 'bitnet logout'