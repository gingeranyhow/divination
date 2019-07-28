require 'yaml'

yam = YAML.load_file "/Users/patrick/code/neocab/Assets/Resources/neo-cab-strings-en-us.yaml"
yam["LocalizedStrings"]

strings = yam["LocalizedStrings"]

sorted_values = strings.values.map {|v| v["String"].to_s }
uniques = sorted_values.uniq

sorted = strings.sort_by {|k, v| v["String"].to_s.size }

dupe_counts = sorted_values.inject(Hash.new(0)) { |total, e| total[e] += 1; total}

canonicals = {}

dupe_counts.each do |k,v|
  if v > 1
    strings.map do |k2, v2|
      if v2 && v2["String"] == k
        canonicals[k] ||= []
        canonicals[k] << k2
      end
    end
  end
end

File.open("/Users/patrick/code/neocab/SourceData/canonicals.yaml", "w") do |f|
  f.write canonicals.to_yaml
end
