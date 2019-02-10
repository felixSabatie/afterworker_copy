class Invite < ApplicationRecord
  before_create :generate_token

  belongs_to :event
  belongs_to :user

  validates :token, uniqueness: true

  private

  def generate_token(length = 50)
    loop do
      token = self.token = SecureRandom.urlsafe_base64(length, false)
      break token unless self.class.exists?(token: token)
    end
  end

end
