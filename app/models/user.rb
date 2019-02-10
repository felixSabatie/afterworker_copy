class User < ApplicationRecord
  validates :pseudo, presence: true, uniqueness: true

  validates :email, presence: true, uniqueness: true
  validates_format_of :email, with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create

  validates :password, presence: true, length: {within: 6..40}

  has_and_belongs_to_many :events

  has_many :invites

  has_secure_password
end
