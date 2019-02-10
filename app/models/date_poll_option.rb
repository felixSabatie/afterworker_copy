class DatePollOption < ApplicationRecord
  belongs_to :event

  has_and_belongs_to_many :voters, -> { distinct }, class_name: :User

end
