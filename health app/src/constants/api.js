// Edamam API account information
export const EDAMAM_ACCT = {
  ID: "8dfb60e3",
  KEY: "0ebf2e266eab69fe198725a418ec4cd9",
}

export const EDAMAM_API_PARSER_URL = `https://api.edamam.com/api/food-database/parser?ingr={parsedFood}&app_id=${EDAMAM_ACCT.ID}&app_key=${EDAMAM_ACCT.KEY}`
export const EDAMAM_API_NUTRITION_URL = `https://api.edamam.com/api/food-database/nutrients?app_id=${EDAMAM_ACCT.ID}&app_key=${EDAMAM_ACCT.KEY}`
export const EDAMAM_MEASURE_URI_PREFIX = 'http://www.edamam.com/ontologies/edamam.owl#Measure_'
