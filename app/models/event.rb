class Event < ApplicationRecord
  before_create :generate_hash
  after_create :add_creator_to_participants

  belongs_to :creator, class_name: :User, foreign_key: 'user_id'
  has_and_belongs_to_many :participants, class_name: :User
  has_many :date_poll_options
  belongs_to :chosen_date, class_name: :DatePollOption, foreign_key: 'date_poll_option_id', optional: true

  validates :event_hash, uniqueness: true
  validates :name, presence: true
  validates :hash, presence: true

  private

  def generate_hash(length=30)
    loop do
      hash = self.event_hash = SecureRandom.urlsafe_base64(length, false)
      break hash unless self.class.exists?(event_hash: hash)
    end
  end

  def add_creator_to_participants
    self.participants << self.creator
  end

end
