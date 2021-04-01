import * as R from 'ramda'



const addEstimated = (arr) => {
    const results = [];
    arr.forEach(item => {
        const itemRes = [];

        item.tasks.forEach((task, taskIndex) => {
            if (taskIndex === item.tasks.length - 1) {
                return itemRes.push({
                    ...task,
                    estimated: 0,
                });
            }

            const time = item.tasks[taskIndex + 1].timestamp - +task.timestamp;
            itemRes.push({
                ...task,
                estimated: time / 3.6e+6,
            })
        });

        results.push({
            date: item.date,
            tasks: itemRes,
        })
    });

    return results;
}

const mergeDublicates = (arr) => {

    return arr.map(arrItem => {
        const taskMap = new Map();

        arrItem.tasks.forEach(i => {
            const cur = taskMap.get(i.id);

            if (cur) {
                taskMap.set(i.id, {
                    ...cur,
                    estimated: cur.estimated += i.estimated,
                });
            } else {
                taskMap.set(i.id, i);
            }
        });

        return {
            ...arrItem,
            tasks: [...taskMap.values()],
        };
    })
};

const fixedEstimated = (arr) =>
    arr.map(i => ({
        ...i,
        tasks: i.tasks.map(elem => ({
            ...elem,
            estimated: elem.estimated.toFixed(1)
        })),
    }))

const addTotals = (arr) =>
    arr.map(i => ({
        ...i,
        totalEstimated: i.tasks.reduce((acc, cur) => acc += cur.estimated, 0).toFixed(1)
    }));

const parseDateKey = (key) => key.replace(/([\d]+)_([\d]+)_([\d]+)/g, '$2.$1.$3');

export function GetData(json) {
    
    const jsonParsed = Object.keys(json).map(key => ({
        date: new Date(parseDateKey(key)),
        tasks: json[key].map(d => ({
            ...d,
            timestamp: new Date(d.timestamp),
        }))
    }));

    jsonParsed.sort((a, b) => +a.date - +b.date);
    return R.compose(fixedEstimated, addTotals, mergeDublicates, addEstimated)(jsonParsed);
}