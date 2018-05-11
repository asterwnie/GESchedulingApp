function DoSomething(depth) {

    console.log(`Do something at level ${depth}`);

    if (depth > 0) {
        DoSomething(depth - 1)
    }
}

DoSomething(4);

console.log('Done calling a recursive function!');