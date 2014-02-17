require 'csv'
require 'json'

CSV::Converters[:blank_to_nil] = lambda do |field|
  field && field.empty? ? nil : field
end

File.open('./hygfull.csv', 'r') do |file|
  csv = CSV.new(file, :headers => true, :header_converters => :symbol, :converters => [:all, :blank_to_nil])
  File.open('./stars2.json', 'w') do |f|
    f.puts csv.to_a.map {|row| row.to_hash }.to_json
  end
end