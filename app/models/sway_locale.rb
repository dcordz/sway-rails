# typed: true

# == Schema Information
#
# Table name: sway_locales
#
#  id         :integer          not null, primary key
#  city       :string           not null
#  state      :string           not null
#  country    :string           default("United States"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SwayLocale < ApplicationRecord
  extend T::Sig

  T::Configuration.inline_type_error_handler = lambda do |error, opts|
    Rails.logger.error error
  end

  has_many :bills

  # use inverse_of to specify relationship
  # https://stackoverflow.com/a/59222913/6410635
  has_many :districts, inverse_of: :sway_locale

  # NOT WORKING
  # has_many :legislators, through: :districts, inverse_of: :sway_locale

  after_initialize :nameify_country, :nameify_region, :nameify_city

  # scope :find_or_create_by_normalized!, lambda { |**keywords|
  #                                         find_or_create_by!(**normalize_keywords(keywords))
  #                                       }
  scope :default_locale, lambda {
                           find_by(city: 'congress',
                                   state: 'congress',
                                   country: 'united_states')
                         }

  class << self
    extend T::Sig

    sig { params(name: String).returns(String) }
    def format_name(name)
      name.strip.downcase.split(' ').join('_')
    end

    # sorbet kwargs - https://sorbet.org/docs/sigs#rest-parameters
    sig { params(kwargs: String).returns(SwayLocale) }
    def find_or_create_by_normalized!(**kwargs)
      SwayLocale.find_or_create_by!(**SwayLocale.new(kwargs).attributes.compact)
    end
  end

  sig { returns(T::Boolean) }
  def is_congress?
    city_name == 'congress' && region_name == 'congress'
  end

  sig { returns(T::Array[District]) }
  def districts
    T.cast(super, T::Array[District])
  end

  sig { returns(T::Array[Legislator]) }
  def legislators
    districts.flat_map { |district| district.legislators }
  end

  sig { returns(String) }
  def name
    "#{city_name}-#{region_name}-#{country_name}"
  end

  sig { returns(String) }
  def reversed_name
    "#{country_name}-#{region_name}-#{city_name}"
  end

  sig { returns(String) }
  def region_code
    T.cast(RegionUtil.from_region_name_to_region_code(region_name), String)
  end

  sig {returns(T::Boolean)}
  def has_geojson?
    File.exist?(geojson_file_name)
  end

  sig { returns(T.nilable(RGeo::GeoJSON::FeatureCollection)) }
  def load_geojson
    return nil unless has_geojson?

    T.let(RGeo::GeoJSON.decode(File.read(geojson_file_name)), RGeo::GeoJSON::FeatureCollection)
  end

  sig { returns(Jbuilder) }
  def to_builder
    Jbuilder.new do |s|
      s.id id
      s.name name
      s.city city
      s.state state
      s.country country

      # districts
      # icon
      # timezone
      # currentSessionStartDateISO
    end
  end

  private

  sig { returns(String) }
  def country_name
    SwayLocale.format_name(T.cast(RegionUtil.from_country_code_to_name(country), String))
  end

  sig { returns(String) }
  def region_name
    SwayLocale.format_name(T.cast(RegionUtil.from_region_code_to_region_name(state), String))
  end

  sig { returns(String) }
  def city_name
    SwayLocale.format_name(T.cast(city, String))
  end

  sig { void }
  def nameify_country
    self.country = country_name
  end

  sig { void }
  def nameify_region
    self.state = region_name
  end

  sig { void }
  def nameify_city
    self.city = city_name
  end

  sig { returns(String) }
  def geojson_file_name
    "storage/#{name}.geojson"
  end
end
