import requests

url = "https://od-api.oxforddictionaries.com/api/v2/domains/:source_lang_domains/:target_lang_domains"

payload = {}
headers = {
  'app_id': '<string>',
  'app_key': '<string>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

