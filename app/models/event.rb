class Event < ApplicationRecord
  belongs_to :creator, class_name: :User, foreign_key: 'user_id'
  has_and_belongs_to_many :participants, class_name: :User

  has_many :date_poll_options
  belongs_to :chosen_date, class_name: :DatePollOption, foreign_key: 'date_poll_option_id', optional: true

  has_many :place_poll_options
  belongs_to :chosen_place, class_name: :PlacePollOption, foreign_key: 'place_poll_option_id', optional: true

  has_many :invites

  validates :event_hash, uniqueness: true
  validates :name, presence: true
  validates :hash, presence: true

  before_create :generate_hash
  after_create :add_creator_to_participants

  def user_is_admin(user)
    user.id === self.user_id
  end

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
