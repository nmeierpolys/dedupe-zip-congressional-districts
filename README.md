# dedupe-zip-congressional-districts

This is a small script to clean up a dataset that contains Zip Code, US-specific Congressional District, Metro Area, Email, Country, and State data. We want the output to be unique per Zip Code, consolidating Congressional District, Metro Area, and Email info per Zip Code.

Note: Some of the data includes international zip codes. Those should not be collapsed into US congressional districts.

## Project setup
```
npm install
```

### Run the script
1. Add an `input.json` file to the root of project containing the dataset you want to clean up. It should be in a format like:
```
[
    {
        "zipCode": 55435,
        "congressionalDistrict": "MN-05",
        "email": "test1@gmail.com",
        "state": "Minnesota",
        "country": "United States of America"
    },
    {
        "zipCode": 55435,
        "congressionalDistrict": "MN-03",
        "email": "test2@gmail.com",
        "metroArea": "Twin Cities Area",
        "state": "Minnesota",
        "country": "United States of America"
    }
]
```

2. Run

```
npm run start
```

The script will generate an `output.csv` file containing the consolidated results.

### Run unit tests
```
npm run test
```
